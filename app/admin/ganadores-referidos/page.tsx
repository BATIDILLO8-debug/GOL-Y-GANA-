'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import AuthGuard from '@/components/AuthGuard'
import LogoutButton from '@/components/LogoutButton'

export default function GanadoresReferidosPage() {

  const [campania, setCampania] = useState<any>(null)
  const [ranking, setRanking] = useState<any[]>([])

  useEffect(() => {

    cargarCampania()
    cargarRanking()

  }, [])

  const cargarCampania = async () => {

    const { data } = await supabase
      .from('campanias_referidos')
      .select('*')
      .eq('activa', true)
      .single()

    if (data) {

      setCampania(data)

    }

  }

  const cargarRanking = async () => {

    const { data } = await supabase
      .from('participantes')
      .select('*')

    if (!data) return

    const rankingTemp = []

    for (const participante of data) {

      const { count } = await supabase
        .from('participantes')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq(
          'referido_por',
          participante.codigo_referido
        )

      rankingTemp.push({
        participante,
        total: count || 0,
      })

    }

    rankingTemp.sort(
      (a, b) => b.total - a.total
    )

    setRanking(
      rankingTemp.slice(0, 20)
    )

  }

  const declararGanador = async (
    item: any
  ) => {

    if (!campania) {

      alert(
        'No existe campaña activa'
      )

      return

    }

    const confirmar =
      confirm(
        `¿Declarar ganador a ${item.participante.nombre}?`
      )

    if (!confirmar) return

    const { error } =
      await supabase
        .from('ganadores_referidos')
        .insert([
          {
            participante_id:
              item.participante.id,

            campania_id:
              campania.id,

            total_referidos:
              item.total,

            observacion:
              'Ganador campaña referidos'
          }
        ])

    if (error) {

      console.log(error)

      alert(error.message)

      return

    }

    alert(
      'Ganador registrado correctamente'
    )

  }

  return (

    <AuthGuard>

      <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-red-700 p-4 md:p-10">

        <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="bg-green-700 p-6">

            <div className="flex justify-end mb-4">

              <LogoutButton />

            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white text-center">

              🏆 GANADORES REFERIDOS

            </h1>

          </div>

          <div className="p-5 md:p-10">

            {campania && (

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-3xl p-5 mb-8">

                <h2 className="text-2xl font-black text-yellow-700">

                  🎁 CAMPAÑA ACTIVA

                </h2>

                <p className="mt-2">

                  {campania.nombre}

                </p>

                <p>

                  Premio:
                  {' '}
                  {campania.premio}

                </p>

                <p>

                  Meta:
                  {' '}
                  {campania.meta_referidos}
                  {' '}
                  referidos

                </p>

              </div>

            )}

            <h2 className="text-2xl md:text-4xl font-black text-blue-900 mb-5">

              🏆 TOP REFERIDOS

            </h2>

            <div className="space-y-4">

              {ranking.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={
                      item.participante.id
                    }
                    className="border-2 rounded-2xl p-4 flex justify-between items-center"
                  >

                    <div>

                      <p className="font-black text-xl">

                        #{index + 1}

                        {' - '}

                        {item.participante.nombre}

                      </p>

                      <p>

                        Referidos:
                        {' '}
                        {item.total}

                      </p>

                    </div>

                    <button
                      onClick={() =>
                        declararGanador(
                          item
                        )
                      }
                      className="bg-green-600 text-white font-black px-4 py-3 rounded-xl"
                    >

                      🏆 GANADORES

                    </button>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </main>

    </AuthGuard>

  )

}