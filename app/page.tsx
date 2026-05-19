'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function Home() {

  const [cedula, setCedula] = useState('')
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [lugarResidencia, setLugarResidencia] = useState('')

  const [marcadorA, setMarcadorA] = useState('')
  const [marcadorB, setMarcadorB] = useState('')

  const [equipoA, setEquipoA] = useState('')
  const [equipoB, setEquipoB] = useState('')

  const [partidoId, setPartidoId] = useState<number | null>(null)

  const [latitud, setLatitud] = useState<number | null>(null)
  const [longitud, setLongitud] = useState<number | null>(null)

  const [aceptaReglamento, setAceptaReglamento] = useState(false)
  const [aceptaDatos, setAceptaDatos] = useState(false)

  const [fechaCierre, setFechaCierre] = useState('')

  const [dias, setDias] = useState('00')
  const [horas, setHoras] = useState('00')
  const [minutos, setMinutos] = useState('00')
  const [segundos, setSegundos] = useState('00')

  // GPS

  useEffect(() => {

    navigator.geolocation.getCurrentPosition((position) => {

      setLatitud(position.coords.latitude)
      setLongitud(position.coords.longitude)

    })

  }, [])

  // CARGAR PARTIDO

  const cargarPartido = async () => {

    const { data } = await supabase
      .from('partidos')
      .select('*')
      .eq('activo', true)
      .single()

    if (data) {

      setEquipoA(data.equipo_a)
      setEquipoB(data.equipo_b)
      setPartidoId(data.id)
      setFechaCierre(data.fecha)
    }
  }

  useEffect(() => {
    cargarPartido()
  }, [])

  // CONTADOR

  useEffect(() => {

    const interval = setInterval(() => {

      if (!fechaCierre) return

      const cierre = new Date(fechaCierre).getTime()
      const ahora = new Date().getTime()

      const diferencia = cierre - ahora

      if (diferencia <= 0) {

        setDias('00')
        setHoras('00')
        setMinutos('00')
        setSegundos('00')

        return
      }

      const d = Math.floor(diferencia / (1000 * 60 * 60 * 24))

      const h = Math.floor(
        (diferencia / (1000 * 60 * 60)) % 24
      )

      const m = Math.floor(
        (diferencia / (1000 * 60)) % 60
      )

      const s = Math.floor(
        (diferencia / 1000) % 60
      )

      setDias(String(d).padStart(2, '0'))
      setHoras(String(h).padStart(2, '0'))
      setMinutos(String(m).padStart(2, '0'))
      setSegundos(String(s).padStart(2, '0'))

    }, 1000)

    return () => clearInterval(interval)

  }, [fechaCierre])

  // BUSCAR PARTICIPANTE

  const buscarParticipante = async (
    valorCedula: string
  ) => {

    if (!valorCedula) return

    const { data } = await supabase
      .from('participantes')
      .select('*')
      .eq('cedula', valorCedula)
      .single()

    if (data) {

      setNombre(data.nombre)
      setCelular(data.celular)
      setLugarResidencia(data.lugar_residencia)
    }
  }

  // GUARDAR PARTICIPACION

  const guardarParticipacion = async () => {

    if (!aceptaReglamento || !aceptaDatos) {

      alert(
        'Debes aceptar el reglamento y la política de datos.'
      )

      return
    }

    // VALIDAR DUPLICADO

    const { data: participanteExistente } = await supabase
      .from('participantes')
      .select('*')
      .eq('cedula', cedula)
      .single()

    if (participanteExistente) {

      const { data: prediccionExistente } = await supabase
        .from('predicciones')
        .select('*')
        .eq(
          'participante_id',
          participanteExistente.id
        )
        .eq('partido_id', partidoId)
        .single()

      if (prediccionExistente) {

        alert(
          '⚠️ Ya existe una participación registrada para esta cédula en este partido.'
        )

        return
      }
    }

    // GENERAR CODIGO

    const codigo = Math.floor(
      1000 + Math.random() * 9000
    ).toString()

    let participanteId = null

    // CREAR PARTICIPANTE SI NO EXISTE

    if (!participanteExistente) {

      const { data, error } = await supabase
        .from('participantes')
        .insert([
          {
            cedula,
            nombre,
            celular,
            lugar_residencia: lugarResidencia,
            codigo,
          },
        ])
        .select()
        .single()

      if (error) {

        console.log(error)

        alert('Error registrando participante')

        return
      }

      participanteId = data.id

    } else {

      participanteId = participanteExistente.id
    }

    // GUARDAR PREDICCION

    const { error } = await supabase
      .from('predicciones')
      .insert([
        {
          participante_id: participanteId,
          partido_id: partidoId,
          marcador_a: marcadorA,
          marcador_b: marcadorB,
          latitud: latitud,
          longitud: longitud,
        },
      ])

    if (error) {

      console.log(error)

      alert('Error guardando participación')

      return
    }

    alert(
      `✅ ¡Participación registrada! Código: ${codigo}`
    )

    setMarcadorA('')
    setMarcadorB('')
  }

  return (

    <main
      className="relative min-h-screen flex justify-center items-center p-10 bg-cover bg-center"
      style={{
        backgroundImage: "url('/fondo.jpg')"
      }}
    >

      {/* CAPA OSCURA */}

      <div className="absolute inset-0 bg-black/40"></div>

      {/* CONTENEDOR */}

      <div className="relative bg-white rounded-[35px] shadow-2xl w-full max-w-2xl overflow-hidden border-[6px] border-blue-900">

        {/* HEADER */}

        <div className="bg-white p-8">

          <div className="flex justify-center">

            <Image
              src="/logo.png"
              alt="Logo"
              width={320}
              height={320}
            />

          </div>

          <h1 className="text-6xl font-black text-center text-blue-900 uppercase leading-none">
            Gol y Gana
          </h1>

          <h2 className="text-center text-4xl font-black text-red-600 uppercase mt-2">
            Con Nuestra Selección
          </h2>

          <div className="flex justify-center items-center gap-4 mt-5">

            <div className="w-20 h-2 bg-yellow-400 rounded-full"></div>

            <p className="text-yellow-600 text-2xl font-black uppercase">
              Amor por lo Nuestro
            </p>

            <div className="w-20 h-2 bg-red-500 rounded-full"></div>

          </div>

        </div>

        {/* TITULO PARTIDO */}

        <div className="bg-blue-900 text-white text-center py-5 text-3xl font-black uppercase">
          Partido Activo
        </div>

        {/* CONTENIDO */}

        <div className="p-8">

          <div className="grid grid-cols-3 items-center text-center mb-8">

            <div>

              <div className="text-7xl mb-3">🇨🇴</div>

              <p className="text-4xl font-black text-blue-900 uppercase">
                {equipoA || 'Colombia'}
              </p>

            </div>

            <div>

              <div className="bg-red-600 text-white text-4xl font-black px-6 py-4 rounded-2xl inline-block shadow-xl">
                VS
              </div>

            </div>

            <div>

              <div className="text-7xl mb-3">🇯🇵</div>

              <p className="text-4xl font-black text-blue-900 uppercase">
                {equipoB || 'Japón'}
              </p>

            </div>

          </div>

          <div className="bg-yellow-50 border-4 border-yellow-300 rounded-3xl p-8 shadow-xl mb-10">

            <div className="text-center mb-6">

              <p className="text-blue-900 font-black text-2xl">
                📅 Cierre del formulario
              </p>

              <p className="text-red-600 text-4xl font-black mt-3">
                {fechaCierre || 'Por definir'}
              </p>

            </div>

            <p className="text-center text-blue-900 text-2xl font-black mb-6 uppercase">
              Faltan para cerrar
            </p>

            <div className="grid grid-cols-4 gap-4">

              <div className="bg-blue-900 rounded-2xl p-5 text-center text-white shadow-xl">

                <p className="text-5xl font-black">
                  {dias}
                </p>

                <p className="text-lg uppercase font-bold mt-2">
                  Días
                </p>

              </div>

              <div className="bg-blue-900 rounded-2xl p-5 text-center text-white shadow-xl">

                <p className="text-5xl font-black">
                  {horas}
                </p>

                <p className="text-lg uppercase font-bold mt-2">
                  Horas
                </p>

              </div>

              <div className="bg-blue-900 rounded-2xl p-5 text-center text-white shadow-xl">

                <p className="text-5xl font-black">
                  {minutos}
                </p>

                <p className="text-lg uppercase font-bold mt-2">
                  Minutos
                </p>

              </div>

              <div className="bg-blue-900 rounded-2xl p-5 text-center text-white shadow-xl">

                <p className="text-5xl font-black">
                  {segundos}
                </p>

                <p className="text-lg uppercase font-bold mt-2">
                  Segundos
                </p>

              </div>

            </div>

          </div>

          <p className="text-center text-blue-900 text-2xl font-bold mb-10">
            🎯 Indica el marcador exacto del partido y participa por premios oficiales.
          </p>

          {/* AQUÍ SIGUE EXACTAMENTE EL RESTO DE TU JSX ORIGINAL */}
          
        </div>

      </div>

    </main>

  )
}