'use client'

import { useState } from 'react'

import AuthGuard
  from '@/components/AuthGuard'

import LogoutButton
  from '@/components/LogoutButton'

export default function
NotificacionesPage() {

  const [titulo,
    setTitulo] =
    useState('')

  const [mensaje,
    setMensaje] =
    useState('')

  const [loading,
    setLoading] =
    useState(false)

  const enviar =
    async () => {

      if (
        !titulo ||
        !mensaje
      ) {

        alert(
          'Complete todos los campos'
        )

        return

      }

      setLoading(true)

      const response =
        await fetch(
          '/api/notificaciones',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify({
                titulo,
                mensaje
              })
          }
        )

      const data =
        await response.json()

      setLoading(false)

      if (!data.success) {

        alert(
          'Error enviando'
        )

        return

      }

      alert(
        `Notificación enviada a ${data.enviados} dispositivos`
      )

      setTitulo('')
      setMensaje('')

    }

  return (

    <AuthGuard>

      <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-red-700 p-4 md:p-10">

        <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl">

          <div className="bg-red-700 p-6">

            <div className="flex justify-end">

              <LogoutButton />

            </div>

            <h1 className="text-center text-white text-3xl md:text-5xl font-black">

              📣 NOTIFICACIONES PUSH

            </h1>

          </div>

          <div className="p-5 md:p-10 space-y-5">

            <input
              placeholder="Título"
              value={titulo}
              onChange={(e) =>
                setTitulo(
                  e.target.value
                )
              }
              className="w-full border-2 rounded-2xl p-4"
            />

            <textarea
              placeholder="Mensaje"
              value={mensaje}
              onChange={(e) =>
                setMensaje(
                  e.target.value
                )
              }
              className="w-full border-2 rounded-2xl p-4 min-h-[180px]"
            />

            <button
              onClick={enviar}
              disabled={loading}
              className="w-full bg-green-600 text-white text-xl md:text-2xl font-black p-5 rounded-2xl"
            >

              {loading
                ? 'ENVIANDO...'
                : '🚀 ENVIAR NOTIFICACIÓN'}

            </button>

          </div>

        </div>

      </main>

    </AuthGuard>

  )

}