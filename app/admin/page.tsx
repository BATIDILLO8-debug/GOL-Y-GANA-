'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

import AuthGuard from '@/components/AuthGuard'
import LogoutButton from '@/components/LogoutButton'

export default function AdminPage() {

  const [equipoA, setEquipoA] = useState('')
  const [equipoB, setEquipoB] = useState('')
  const [fecha, setFecha] = useState('')

  const crearPartido = async () => {

    if (!equipoA || !equipoB || !fecha) {

      alert('Completa todos los campos')
      return
    }

    await supabase
      .from('partidos')
      .update({ activo: false })
      .neq('id', 0)

    const { error } = await supabase
      .from('partidos')
      .insert([
        {
          equipo_a: equipoA,
          equipo_b: equipoB,
          fecha: fecha,
          activo: true,
        },
      ])

    if (error) {

      console.log(error)
      alert('Error creando partido')
      return
    }

    alert('⚽ Partido creado correctamente')

    setEquipoA('')
    setEquipoB('')
    setFecha('')
  }

  return (

    <AuthGuard>

      <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-red-700 p-10">

        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* HEADER */}

          <div className="bg-yellow-400 p-6">

            <div className="flex justify-end mb-4">

              <LogoutButton />

            </div>

            <div className="text-center">

              <h1 className="text-5xl font-black text-blue-900 uppercase">
                Panel Admin
              </h1>

              <p className="text-red-600 text-2xl font-bold mt-2">
                Gol y Gana con Nuestra Selección
              </p>

            </div>

          </div>

          {/* CONTENIDO */}

          <div className="p-10">

            <h2 className="text-3xl font-black text-blue-900 mb-8">
              Crear Partido
            </h2>

            <div className="space-y-6">

              <input
                type="text"
                placeholder="Equipo A"
                value={equipoA}
                onChange={(e) => setEquipoA(e.target.value)}
                className="w-full border-2 border-blue-900 rounded-2xl p-5 text-2xl"
              />

              <input
                type="text"
                placeholder="Equipo B"
                value={equipoB}
                onChange={(e) => setEquipoB(e.target.value)}
                className="w-full border-2 border-blue-900 rounded-2xl p-5 text-2xl"
              />

              <input
                type="datetime-local"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border-2 border-blue-900 rounded-2xl p-5 text-2xl"
              />

              <button
                onClick={crearPartido}
                className="w-full bg-gradient-to-r from-yellow-400 via-red-500 to-blue-900 text-white text-3xl font-black p-6 rounded-3xl shadow-2xl hover:scale-105 transition-all"
              >
                ⚽ CREAR PARTIDO
              </button>

            </div>

          </div>

        </div>

      </main>

    </AuthGuard>
  )
}