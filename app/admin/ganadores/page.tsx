'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AuthGuard from '../../../components/AuthGuard'

export default function GanadoresPage() {

  const [partidos, setPartidos] = useState<any[]>([])
  const [partidoId, setPartidoId] = useState('')

  const [marcadorA, setMarcadorA] = useState('')
  const [marcadorB, setMarcadorB] = useState('')

  const [ganadores, setGanadores] = useState<any[]>([])

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

  const buscarGanadores = async () => {

    const { data } = await supabase
      .from('predicciones')
      .select(`
        *,
        participantes (
          nombre,
          cedula,
          celular,
          lugar_residencia
        )
      `)
      .eq('partido_id', partidoId)
      .eq('marcador_a', marcadorA)
      .eq('marcador_b', marcadorB)

    setGanadores(data || [])
  }

  return (

    <AuthGuard>

      <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-red-700 p-10">

        <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl">

          <div className="bg-yellow-400 p-6 text-center">

            <img
              src="/logo.png"
              className="w-32 mx-auto mb-4"
            />

            <h1 className="text-5xl font-black text-blue-900">
              GANADORES
            </h1>

          </div>

          <div className="p-8 grid md:grid-cols-4 gap-5">

            <select
              value={partidoId}
              onChange={(e) => setPartidoId(e.target.value)}
              className="border-2 border-blue-900 rounded-2xl p-4"
            >

              <option value="">
                Selecciona partido
              </option>

              {partidos.map((partido) => (

                <option
                  key={partido.id}
                  value={partido.id}
                >
                  {partido.equipo_a} vs {partido.equipo_b}
                </option>

              ))}

            </select>

            <input
              type="number"
              placeholder="Goles A"
              value={marcadorA}
              onChange={(e) => setMarcadorA(e.target.value)}
              className="border-2 border-blue-900 rounded-2xl p-4"
            />

            <input
              type="number"
              placeholder="Goles B"
              value={marcadorB}
              onChange={(e) => setMarcadorB(e.target.value)}
              className="border-2 border-blue-900 rounded-2xl p-4"
            />

            <button
              onClick={buscarGanadores}
              className="bg-blue-900 text-white rounded-2xl font-black"
            >
              🔎 BUSCAR
            </button>

          </div>

        </div>

      </main>

    </AuthGuard>
  )
}