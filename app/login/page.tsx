'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'


export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const iniciarSesion = async () => {

    if (!email || !password) {

      alert('Completa todos los campos')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {

      alert(error.message)
      return
    }

    router.push('/admin')
  }

  return (

    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-10"
      style={{
        backgroundImage: "url('/fondo.jpg')"
      }}
    >

      {/* CAPA OSCURA */}

      <div className="absolute inset-0 bg-black/60"></div>

      {/* CARD */}

      <div className="relative z-10 bg-white rounded-[40px] shadow-2xl overflow-hidden w-full max-w-2xl">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-blue-900 p-8 text-center">

          <h1 className="text-4xl md:text-6xl font-black text-white uppercase">
            Login Admin
          </h1>

          <p className="text-lg md:text-2xl text-white font-bold mt-3">
            Gol y Gana con Nuestra Selección
          </p>

        </div>

        {/* CONTENIDO */}

        <div className="p-5 md:p-10">

          <div className="space-y-8">

            {/* EMAIL */}

            <div>

              <label className="block text-2xl font-black text-blue-900 mb-3">
                Correo electrónico
              </label>

              <input
                type="email"
                placeholder="admin@golygana.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-blue-900 rounded-2xl p-6 text-2xl text-black font-bold placeholder:text-gray-500"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-2xl font-black text-blue-900 mb-3">
                Contraseña
              </label>

              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-blue-900 rounded-2xl p-6 text-2xl text-black font-bold placeholder:text-gray-500"
              />

            </div>

            {/* BOTON */}

            <button
              onClick={iniciarSesion}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 via-red-500 to-blue-900 text-white text-4xl font-black py-6 rounded-3xl shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
            >

              {loading
                ? 'Ingresando...'
                : '🔐 INGRESAR'}

            </button>

          </div>

        </div>

      </div>

    </main>
  )
}