'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

import AuthGuard from '@/components/AuthGuard'
import LogoutButton from '@/components/LogoutButton'

export default function PatrocinadoresPage() {

  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const guardarPatrocinador = async () => {

    if (!nombre) {

      alert('Ingrese el nombre')

      return

    }

    const { error } = await supabase
      .from('patrocinadores')
      .insert([
        {
          nombre,
          contacto,
          telefono,
          email,
          descripcion
        }
      ])

    if (error) {

      console.log(error)

      alert('Error guardando patrocinador')

      return

    }

    alert('Patrocinador registrado')

    setNombre('')
    setContacto('')
    setTelefono('')
    setEmail('')
    setDescripcion('')

  }

  return (

    <AuthGuard>

      <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-red-700 p-10">

        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="bg-purple-700 p-6">

            <div className="flex justify-end mb-4">

              <LogoutButton />

            </div>

            <h1 className="text-5xl font-black text-white text-center">

              🤝 PATROCINADORES

            </h1>

          </div>

          <div className="p-10 space-y-5">

            <input
              placeholder="Nombre empresa"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              className="w-full border-2 rounded-2xl p-4"
            />

            <input
              placeholder="Contacto"
              value={contacto}
              onChange={(e) =>
                setContacto(e.target.value)
              }
              className="w-full border-2 rounded-2xl p-4"
            />

            <input
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) =>
                setTelefono(e.target.value)
              }
              className="w-full border-2 rounded-2xl p-4"
            />

            <input
              placeholder="Correo"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border-2 rounded-2xl p-4"
            />

            <textarea
              placeholder="Descripción"
              value={descripcion}
              onChange={(e) =>
                setDescripcion(e.target.value)
              }
              className="w-full border-2 rounded-2xl p-4"
            />

            <button
              onClick={guardarPatrocinador}
              className="w-full bg-green-600 text-white font-black p-5 rounded-2xl"
            >
              GUARDAR PATROCINADOR
            </button>

          </div>

        </div>

      </main>

    </AuthGuard>

  )

}