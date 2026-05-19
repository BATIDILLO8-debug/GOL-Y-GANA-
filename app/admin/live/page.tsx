'use client'

import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'

import AuthGuard from '../../../components/AuthGuard'
import LogoutButton from '../../../components/LogoutButton'

export default function LivePage() {

  const [ganadores, setGanadores] = useState<any[]>([])

  const [indiceActual, setIndiceActual] = useState(0)

  // CARGAR GANADORES

  const cargarGanadores = async () => {

    const { data, error } = await supabase
      .from('predicciones')
      .select(`
        *,
        participantes (
          nombre,
          lugar_residencia
        )
      `)
      .limit(100)

    if (error) {

      console.log(error)

      return
    }

    setGanadores(data || [])
  }

  useEffect(() => {
    cargarGanadores()
  }, [])

  // AUTO CAMBIO

  useEffect(() => {

    if (ganadores.length === 0) return

    const interval = setInterval(() => {

      setIndiceActual((prev) => {

        if (prev >= ganadores.length - 1) {

          return 0
        }

        return prev + 1

      })

    }, 5000)

    return () => clearInterval(interval)

  }, [ganadores])

  const ganador = ganadores[indiceActual]

  return (

    <AuthGuard>

      <main
        className="min-h-screen bg-cover bg-center flex items-center justify-center p-10"
        style={{
          backgroundImage: "url('/fondo.jpg')"
        }}
      >

        {/* CAPA OSCURA */}

        <div className="absolute inset-0 bg-black/70"></div>

        {/* CONTENIDO */}

        <div className="relative z-10 text-center max-w-5xl w-full">

          {/* TOP BAR */}

          <div className="flex justify-end mb-6">

            <LogoutButton />

          </div>

          {/* LOGO */}

          <img
            src="/logo.png"
            alt="Logo"
            className="w-40 mx-auto mb-8 drop-shadow-2xl"
          />

          {/* TITULO */}

          <div className="mb-10">

            <h1 className="text-7xl font-black text-yellow-400 uppercase drop-shadow-2xl">
              🎉 Sorteo Oficial
            </h1>

            <p className="text-4xl text-white font-bold mt-4">
              Gol y Gana con Nuestra Selección
            </p>

          </div>

          {/* CARD GANADOR */}

          <div className="bg-white/10 backdrop-blur-xl border-4 border-yellow-400 rounded-[40px] p-16 shadow-2xl">

            <p className="text-5xl text-white font-black uppercase mb-8">
              🏆 Ganador Seleccionado
            </p>

            {/* EFECTO CIRCULO */}

            <div className="w-52 h-52 rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-blue-900 mx-auto flex items-center justify-center shadow-2xl border-8 border-white mb-10 animate-pulse">

              <p className="text-8xl">
                🎁
              </p>

            </div>

            {/* NOMBRE */}

            <h2 className="text-7xl font-black text-yellow-300 uppercase mb-6 drop-shadow-xl">

              {ganador?.participantes?.nombre || 'Esperando...'}

            </h2>

            {/* RESIDENCIA */}

            <p className="text-4xl text-white font-bold mb-10">

              📍
              {' '}
              {ganador?.participantes?.lugar_residencia || ''}

            </p>

            {/* PREMIO */}

            <div className="inline-block bg-gradient-to-r from-yellow-400 via-red-500 to-blue-900 px-14 py-7 rounded-3xl shadow-2xl">

              <p className="text-5xl text-white font-black uppercase">
                🧢 Premio Oficial
              </p>

            </div>

          </div>

          {/* CONTADOR */}

          <div className="mt-10">

            <p className="text-2xl text-white font-bold">
              Cambiando automáticamente cada 5 segundos
            </p>

          </div>

        </div>

      </main>

    </AuthGuard>
  )
}