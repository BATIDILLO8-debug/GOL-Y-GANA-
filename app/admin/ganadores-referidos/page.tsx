'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import AuthGuard from '@/components/AuthGuard'
import LogoutButton from '@/components/LogoutButton'

export default function GanadoresReferidosPage() {

const [campania, setCampania] =
useState<any>(null)

const [premio, setPremio] =
useState<any>(null)

const [ranking, setRanking] =
useState<any[]>([])

useEffect(() => {


cargarCampania()


}, [])

const cargarCampania = async () => {


const { data } = await supabase
  .from('campanias_referidos')
  .select('*')
  .eq('activa', true)
  .single()

if (!data) return

setCampania(data)

const { data: premioData } =
  await supabase
    .from('premios')
    .select('*')
    .eq('id', data.premio_id)
    .single()

if (premioData) {

  setPremio(premioData)

}

cargarRanking()


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

    total: count || 0

  })

}

rankingTemp.sort(
  (a, b) => b.total - a.total
)

setRanking(rankingTemp)


}

const generarGanadores = async () => {


if (!campania) {

  alert(
    'No existe campaña activa'
  )

  return

}

if (!premio) {

  alert(
    'No existe premio asociado'
  )

  return

}

const cantidadGanadores =
  premio.cantidad || 1

const confirmar = confirm(

  `Se seleccionarán automáticamente los ${cantidadGanadores} mejores referidores. ¿Desea continuar?`

)

if (!confirmar) return

await supabase
  .from('ganadores_referidos')
  .delete()
  .eq(
    'campania_id',
    campania.id
  )

const topGanadores =
  ranking.slice(
    0,
    cantidadGanadores
  )

for (
  let i = 0;
  i < topGanadores.length;
  i++
) {

  const ganador =
    topGanadores[i]

  await supabase
    .from('ganadores_referidos')
    .insert([
      {
        participante_id:
          ganador.participante.id,

        campania_id:
          campania.id,

        premio_id:
          premio.id,

        posicion:
          i + 1,

        total_referidos:
          ganador.total,

        observacion:
          `Ganador automático puesto ${i + 1}`
      }
    ])

}

await supabase
  .from('campanias_referidos')
  .update({
    activa: false
  })
  .eq(
    'id',
    campania.id
  )

alert(
  `${topGanadores.length} ganadores registrados correctamente`
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

            <p className="mt-3 font-bold">

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

            </p>

          </div>

        )}

        <h2 className="text-2xl md:text-4xl font-black text-blue-900 mb-5">

          🏆 RANKING REFERIDOS

        </h2>

        <div className="space-y-3">

          {ranking.slice(0, 20).map(
            (
              item,
              index
            ) => (

              <div
                key={
                  item.participante.id
                }
                className="border-2 rounded-2xl p-4 bg-gray-50"
              >

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

            )
          )}

        </div>

        <button
          onClick={
            generarGanadores
          }
          className="w-full mt-8 bg-green-700 hover:bg-green-800 text-white font-black text-2xl p-5 rounded-2xl"
        >

          🏆 GENERAR GANADORES AUTOMÁTICOS

        </button>

      </div>

    </div>

  </main>

</AuthGuard>


)

}
