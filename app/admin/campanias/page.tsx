'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import AuthGuard from '@/components/AuthGuard'
import LogoutButton from '@/components/LogoutButton'

export default function CampaniasPage() {

  const [premios, setPremios] = useState<any[]>([])
  const [campanias, setCampanias] = useState<any[]>([])

  const [premioId, setPremioId] = useState('')
  const [metaReferidos, setMetaReferidos] = useState('50')

  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')

  const cargarPremios = async () => {

    const { data } = await supabase
      .from('premios')
      .select(`
        *,
        patrocinadores (
          nombre
        )
      `)

    if (data) {

      setPremios(data)

    }

  }

  const cargarCampanias = async () => {

    const { data } = await supabase
      .from('campanias_referidos')
      .select('*')
      .order('id', {
        ascending: false
      })

    if (data) {

      setCampanias(data)

    }

  }

  useEffect(() => {

    cargarPremios()
    cargarCampanias()

  }, [])

  const activarCampania = async () => {

    const premioSeleccionado =
      premios.find(
        item =>
          item.id.toString() === premioId
      )

    if (!premioSeleccionado) {

      alert('Seleccione un premio')
      return

    }

    await supabase
      .from('campanias_referidos')
      .update({
        activa: false
      })
      .neq('id', 0)

    const { error } =
      await supabase
        .from('campanias_referidos')
        .insert([
          {
             descripcion: premioSeleccionado.descripcion,
  patrocinador: premioSeleccionado?.patrocinadores?.nombre,
  premio: premioSeleccionado.nombre,
  premio_id: Number(premioId),
  imagen: premioSeleccionado.imagen,
  meta_referidos: Number(metaReferidos),
  fecha_inicio: fechaInicio,
  fecha_fin: fechaFin,
  activa: true
          }
        ])

    if (error) {

      console.log(error)

      alert(error.message)

      return

    }

    alert(
      'Campaña activada correctamente'
    )

    setPremioId('')
    setMetaReferidos('50')

    setFechaInicio('')
    setFechaFin('')

    cargarCampanias()

  }

  return (

    <AuthGuard>

      <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-red-700 p-4 md:p-10">

        <div className="max-w-6xl w-full mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl">

          <div className="bg-yellow-500 p-6">

            <div className="flex justify-end mb-4">

              <LogoutButton />

            </div>

            <h1 className="text-3xl md:text-5xl font-black text-center text-blue-950">

              🎁 CAMPAÑAS

            </h1>

          </div>

          <div className="p-5 md:p-10 space-y-5">

            <label className="font-black text-blue-900">

              Premio

            </label>

            <select
              value={premioId}
              onChange={(e) =>
                setPremioId(
                  e.target.value
                )
              }
              className="w-full border-2 rounded-2xl p-4"
            >

              <option value="">
                Seleccione premio
              </option>

              {premios.map(
                (premio) => (

                  <option
                    key={premio.id}
                    value={premio.id}
                  >

                    {premio.nombre}

                  </option>

                )
              )}

            </select>

            <label className="font-black text-blue-900">

              Meta de referidos

            </label>

            <input
              type="number"
              value={metaReferidos}
              onChange={(e) =>
                setMetaReferidos(
                  e.target.value
                )
              }
              className="w-full border-2 rounded-2xl p-4"
            />

            <label className="font-black text-blue-900">

              Fecha inicio

            </label>

            <input
              type="datetime-local"
              value={fechaInicio}
              onChange={(e) =>
                setFechaInicio(
                  e.target.value
                )
              }
              className="w-full border-2 rounded-2xl p-4"
            />

            <label className="font-black text-blue-900">

              Fecha final

            </label>

            <input
              type="datetime-local"
              value={fechaFin}
              onChange={(e) =>
                setFechaFin(
                  e.target.value
                )
              }
              className="w-full border-2 rounded-2xl p-4"
            />

            <button
              onClick={activarCampania}
              className="w-full bg-green-600 text-white font-black p-5 rounded-2xl"
            >

              🚀 ACTIVAR CAMPAÑA

            </button>

            <hr />

            <h2 className="text-2xl md:text-4xl font-black text-blue-900">

              📋 HISTORIAL DE CAMPAÑAS

            </h2>

            <div className="space-y-4">

              {campanias.map(
                (campania) => (

                  <div
                    key={campania.id}
                    className="border-2 rounded-2xl p-4 bg-gray-50"
                  >

                    <p className="font-black text-xl">

                      {campania.nombre}

                    </p>

                    <p>

                      🎁 {campania.premio}

                    </p>

                    <p>

                      🎯 Meta:
                      {' '}
                      {campania.meta_referidos}

                    </p>

                    <p>

                      🏢 {campania.patrocinador}

                    </p>

                    <p>

                      {campania.activa
                        ? '🟢 ACTIVA'
                        : '⚪ INACTIVA'}

                    </p>

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