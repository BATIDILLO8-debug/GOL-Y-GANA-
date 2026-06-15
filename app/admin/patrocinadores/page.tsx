'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

import AuthGuard from '@/components/AuthGuard'
import LogoutButton from '@/components/LogoutButton'

export default function PatrocinadoresPage() {
const [logoFile, setLogoFile] =
  useState<File | null>(null)

const [imagenPremioFile, setImagenPremioFile] =
  useState<File | null>(null)
  const [nombre, setNombre] = useState('')
  const [contacto, setContacto] = useState('')
  const [telefono, setTelefono] = useState('')
  const [email, setEmail] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [nombrePremio, setNombrePremio] = useState('')
const [descripcionPremio, setDescripcionPremio] = useState('')
const [valorPremio, setValorPremio] = useState('')
const [cantidadPremio, setCantidadPremio] = useState('1')
const [patrocinadores, setPatrocinadores] = useState<any[]>([])

  const guardarPatrocinador = async () => {
let logoUrl = ''
let imagenPremioUrl = ''
if (logoFile) {

  const nombreArchivo =
    `${Date.now()}-${logoFile.name}`

  const { error } =
    await supabase.storage
      .from('patrocinadores')
      .upload(
        nombreArchivo,
        logoFile
      )

  if (!error) {

    const { data } =
      supabase.storage
        .from('patrocinadores')
        .getPublicUrl(
          nombreArchivo
        )

    logoUrl =
      data.publicUrl

  }

}
  if (!nombre) {

    alert('Ingrese el nombre del patrocinador')
    return

  }

  if (!nombrePremio) {

    alert('Ingrese el premio')
    return

  }
if (imagenPremioFile) {

  const nombreArchivo =
    `${Date.now()}-${imagenPremioFile.name}`

  const { error } =
    await supabase.storage
      .from('premios')
      .upload(
        nombreArchivo,
        imagenPremioFile
      )

  if (!error) {

    const { data } =
      supabase.storage
        .from('premios')
        .getPublicUrl(
          nombreArchivo
        )

    imagenPremioUrl =
      data.publicUrl

  }

}
  const { data: patrocinador, error } =
    await supabase
      .from('patrocinadores')
      .insert([
        {
          nombre,
          contacto,
          telefono,
          email,
          descripcion,
            logo: logoUrl,
        }
      ])
      .select()
      .single()

  if (error) {

    console.log(error)

    alert(error.message)

    return

  }

  const { error: errorPremio } =
    await supabase
      .from('premios')
      .insert([
        
         {
  patrocinador_id:
    patrocinador.id,

  nombre:
    nombrePremio,

  descripcion:
    descripcionPremio,

  imagen:
    imagenPremioUrl,

  valor:
    valorPremio
      ? Number(valorPremio)
      : null,

  cantidad:
    Number(cantidadPremio),

  activo: true
}
      ])

  if (errorPremio) {

    console.log(errorPremio)

    alert(
      errorPremio.message
    )

    return

  }

  alert(
    'Patrocinador y premio registrados'
  )
  await cargarPatrocinadores()

  setNombre('')
  setContacto('')
  setTelefono('')
  setEmail('')
  setDescripcion('')

  setNombrePremio('')
  setDescripcionPremio('')
  setValorPremio('')
  setCantidadPremio('1')

}
const cargarPatrocinadores = async () => {

  const { data } = await supabase
    .from('patrocinadores')
    .select(`
      *,
      premios (*)
    `)
    .order('id', {
      ascending: false
    })

  if (data) {

    setPatrocinadores(data)

  }

}
useEffect(() => {

  cargarPatrocinadores()

}, [])
  return (

    <AuthGuard>

      <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-red-700 p-4 md:p-10">

        <div className="max-w-5xl w-full mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="bg-purple-700 p-6">

            <div className="flex justify-end mb-4">

              <LogoutButton />

            </div>

          <h1 className="text-3xl md:text-5xl font-black text-white text-center">

              🤝 PATROCINADORES

            </h1>

          </div>

          <div className="p-4 md:p-10 space-y-5">

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
            <div>

  <label className="block font-black text-blue-900 mb-2">

    📷 Logo del patrocinador

  </label>

  <input
    type="file"
    accept="image/*"
    capture="environment"
    onChange={(e) => {

      const file =
        e.target.files?.[0]

      if (file) {

        setLogoFile(file)

      }

    }}
    className="w-full border-2 rounded-2xl p-3"
  />

</div>
<hr className="my-6" />

<h2 className="text-2xl font-black text-purple-700">

🎁 PREMIO APORTADO

</h2>

<input
  placeholder="Nombre premio"
  value={nombrePremio}
  onChange={(e) =>
    setNombrePremio(
      e.target.value
    )
  }
  className="w-full border-2 rounded-2xl p-4"
/>

<textarea
  placeholder="Descripción premio"
  value={descripcionPremio}
  onChange={(e) =>
    setDescripcionPremio(
      e.target.value
    )
  }
  className="w-full border-2 rounded-2xl p-4"
/>

<input
  type="number"
  placeholder="Valor aproximado"
  value={valorPremio}
  onChange={(e) =>
    setValorPremio(
      e.target.value
    )
  }
  className="w-full border-2 rounded-2xl p-4"
/>

<input
  type="number"
  placeholder="Cantidad"
  value={cantidadPremio}
  onChange={(e) =>
    setCantidadPremio(
      e.target.value
    )
  }
  className="w-full border-2 rounded-2xl p-4"
/>
<div>

  <label className="block font-black text-blue-900 mb-2">

    📷 Imagen del premio

  </label>

  <input
    type="file"
    accept="image/*"
    capture="environment"
    onChange={(e) => {

      const file =
        e.target.files?.[0]

      if (file) {

        setImagenPremioFile(file)

      }

    }}
    className="w-full border-2 rounded-2xl p-3"
  />

</div>
            <button
              onClick={guardarPatrocinador}
              className="w-full bg-green-600 text-white font-black p-5 rounded-2xl"
            >
              GUARDAR PATROCINADOR Y PREMIOS
            </button>
<hr className="my-8" />

<h2 className="text-2xl md:text-4xl font-black text-blue-900">

📋 PATROCINADORES REGISTRADOS

</h2>

<div className="space-y-5">

  {patrocinadores.map(
    (patrocinador) => (

      <div
        key={patrocinador.id}
        className="border-2 rounded-3xl p-5 bg-gray-50"
      >

        <h3 className="text-xl md:text-3xl font-black text-purple-700">

          {patrocinador.nombre}

        </h3>

        <p>
          👤 {patrocinador.contacto}
        </p>

        <p>
          📞 {patrocinador.telefono}
        </p>

        <p>
          📧 {patrocinador.email}
        </p>

        <p className="mt-2 text-gray-600">
          {patrocinador.descripcion}
        </p>

        <div className="mt-4">

          <p className="font-black text-green-700">

            🎁 PREMIOS

          </p>

          {patrocinador.premios?.map(
            (premio: any) => (

              <div
                key={premio.id}
                className="bg-white rounded-xl border mt-2 p-3"
              >

                <p className="font-bold">

                  {premio.nombre}

                </p>

                <p className="text-sm text-gray-600">

                  {premio.descripcion}

                </p>

                <p>

                  Cantidad:
                  {' '}
                  {premio.cantidad}

                </p>

                <p>

                  Valor:
                  {' '}
                  $
                  {Number(
                    premio.valor || 0
                  ).toLocaleString()}

                </p>

              </div>

            )
          )}

        </div>

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