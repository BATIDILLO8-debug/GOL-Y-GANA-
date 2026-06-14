'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'

import AuthGuard from '@/components/AuthGuard'
import LogoutButton from '@/components/LogoutButton'

export default function GanadoresPage() {

  const [partidos, setPartidos] = useState<any[]>([])
  const [partidoId, setPartidoId] = useState('')

  const [marcadorA, setMarcadorA] = useState('')
  const [marcadorB, setMarcadorB] = useState('')

  const [ganadores, setGanadores] = useState<any[]>([])

  // CARGAR PARTIDOS

  const cargarPartidos = async () => {

    const { data } = await supabase
      .from('partidos')
      .select('*')
      .order('id', { ascending: false })

    setPartidos(data || [])
  }

  useEffect(() => {
    cargarPartidos()
  }, [])

  // BUSCAR ACERTANTES

  const buscarGanadores = async () => {

    const { data, error } = await supabase
      .from('predicciones')
      .select(`
        *,
        participantes (
          nombre,
          cedula,
          celular,
          lugar_residencia
        ),
        partidos (
          equipo_a,
          equipo_b
        )
      `)
      .eq('partido_id', partidoId)
      .eq('marcador_a', marcadorA)
      .eq('marcador_b', marcadorB)

    if (error) {

      console.log(error)

      alert('Error buscando acertantes')

      return
    }

    setGanadores(data || [])
  }

  return (

    <AuthGuard>

      <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-red-700 p-10">

        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}

          <div className="bg-yellow-400 p-6">

            <div className="flex justify-end mb-4">

              <LogoutButton />
<a
  href="/admin"
  className="inline-block bg-blue-900 text-white px-6 py-3 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all"
>
  ⬅️ VOLVER AL PANEL ADMIN
</a>
            </div>

            <div className="text-center">

              <img
                src="/logo.png"
                alt="Logo"
                className="w-32 mx-auto mb-4"
              />

              <h1 className="text-5xl font-black text-blue-900 uppercase">
                Ganadores
              </h1>

              <p className="text-red-600 text-2xl font-bold mt-2">
                Buscar acertantes
              </p>

            </div>

          </div>

          {/* FILTRO */}

          <div className="p-8 bg-gray-100 border-b">

            <div className="grid md:grid-cols-4 gap-5">

              <select
                value={partidoId}
                onChange={(e) => setPartidoId(e.target.value)}
                className="border-2 border-blue-900 rounded-2xl p-4 text-xl"
              >

                <option value="">
                  Selecciona partido
                </option>

                {partidos.map((partido) => (

                  <option
                    key={partido.id}
                    value={partido.id}
                  >
                    {partido.equipo_a}
                    {' '}
                    vs
                    {' '}
                    {partido.equipo_b}
                  </option>

                ))}

              </select>

              <input
                type="number"
                placeholder="Goles A"
                value={marcadorA}
                onChange={(e) => setMarcadorA(e.target.value)}
                className="border-2 border-blue-900 rounded-2xl p-4 text-xl"
              />

              <input
                type="number"
                placeholder="Goles B"
                value={marcadorB}
                onChange={(e) => setMarcadorB(e.target.value)}
                className="border-2 border-blue-900 rounded-2xl p-4 text-xl"
              />

              <button
                onClick={buscarGanadores}
                className="bg-gradient-to-r from-yellow-400 via-red-500 to-blue-900 text-white text-2xl font-black rounded-2xl"
              >
                🔎 BUSCAR
              </button>

            </div>

          </div>

          {/* TOTAL */}

          <div className="p-6 bg-blue-900 text-white text-3xl font-black text-center">

            🎯 Total acertantes:
            {' '}
            {ganadores.length}

          </div>

          {/* TABLA */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-blue-800 text-white">

                <tr>

                  <th className="p-5 text-left">
                    Nombre
                  </th>

                  <th className="p-5 text-left">
                    Cédula
                  </th>

                  <th className="p-5 text-left">
                    Celular
                  </th>

                  <th className="p-5 text-left">
                    Residencia
                  </th>

                  <th className="p-5 text-left">
                    Marcador
                  </th>

                </tr>

              </thead>

              <tbody>

                {ganadores.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b hover:bg-yellow-50"
                  >

                    <td className="p-5">
                      {item.participantes?.nombre}
                    </td>

                    <td className="p-5">
                      {item.participantes?.cedula}
                    </td>

                    <td className="p-5">
                      {item.participantes?.celular}
                    </td>

                    <td className="p-5">
                      {item.participantes?.lugar_residencia}
                    </td>

                    <td className="p-5 text-3xl font-black text-red-600">
                      {item.marcador_a}
                      {' - '}
                      {item.marcador_b}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </AuthGuard>
  )
}