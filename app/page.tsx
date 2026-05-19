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

      const d = Math.floor(
        diferencia / (1000 * 60 * 60 * 24)
      )

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

    const codigo = Math.floor(
      1000 + Math.random() * 9000
    ).toString()

    let participanteId = null

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
      className="relative min-h-screen flex justify-center items-center p-3 md:p-10 bg-cover bg-center"
      style={{
        backgroundImage: "url('/fondo.jpg')"
      }}
    >

      {/* CAPA OSCURA */}

      <div className="absolute inset-0 bg-black/40"></div>

      {/* CONTENEDOR */}

      <div className="relative bg-white rounded-[25px] md:rounded-[35px] shadow-2xl w-full max-w-2xl overflow-hidden border-[4px] md:border-[6px] border-blue-900">

        {/* HEADER */}

        <div className="bg-white p-4 md:p-8">

          <div className="flex justify-center">

            <Image
              src="/logo.png"
              alt="Logo"
              width={280}
              height={280}
              className="w-44 md:w-72 h-auto"
            />

          </div>

          <h1 className="text-3xl md:text-6xl font-black text-center text-blue-900 uppercase leading-none">
            Gol y Gana
          </h1>

          <h2 className="text-center text-xl md:text-4xl font-black text-red-600 uppercase mt-2">
            Con Nuestra Selección
          </h2>

          <div className="flex justify-center items-center gap-2 md:gap-4 mt-4 md:mt-5">

            <div className="w-10 md:w-20 h-2 bg-yellow-400 rounded-full"></div>

            <p className="text-yellow-600 text-sm md:text-2xl font-black uppercase text-center">
              Amor por lo Nuestro
            </p>

            <div className="w-10 md:w-20 h-2 bg-red-500 rounded-full"></div>

          </div>

        </div>

        {/* TITULO */}

        <div className="bg-blue-900 text-white text-center py-4 md:py-5 text-xl md:text-3xl font-black uppercase">
          Partido Activo
        </div>

        {/* CONTENIDO */}

        <div className="p-4 md:p-8">

          {/* EQUIPOS */}

          <div className="grid grid-cols-3 items-center text-center mb-8 gap-2">

            <div>

              <div className="text-4xl md:text-7xl mb-3">
                🇨🇴
              </div>

              <p className="text-lg md:text-4xl font-black text-blue-900 uppercase">
                {equipoA || 'Colombia'}
              </p>

            </div>

            <div>

              <div className="bg-red-600 text-white text-xl md:text-4xl font-black px-3 md:px-6 py-2 md:py-4 rounded-2xl inline-block shadow-xl">
                VS
              </div>

            </div>

            <div>

              <div className="text-4xl md:text-7xl mb-3">
                🇯🇵
              </div>

              <p className="text-lg md:text-4xl font-black text-blue-900 uppercase">
                {equipoB || 'Japón'}
              </p>

            </div>

          </div>

          {/* FECHA */}

          <div className="bg-yellow-50 border-4 border-yellow-300 rounded-3xl p-4 md:p-8 shadow-xl mb-10">

            <div className="text-center mb-6">

              <p className="text-blue-900 font-black text-lg md:text-2xl">
                📅 Cierre del formulario
              </p>

              <p className="text-red-600 text-xl md:text-4xl font-black mt-3">
                {fechaCierre || 'Por definir'}
              </p>

            </div>

            <p className="text-center text-blue-900 text-lg md:text-2xl font-black mb-6 uppercase">
              Faltan para cerrar
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className="bg-blue-900 rounded-2xl p-4 md:p-5 text-center text-white shadow-xl">

                <p className="text-3xl md:text-5xl font-black">
                  {dias}
                </p>

                <p className="text-sm md:text-lg uppercase font-bold mt-2">
                  Días
                </p>

              </div>

              <div className="bg-blue-900 rounded-2xl p-4 md:p-5 text-center text-white shadow-xl">

                <p className="text-3xl md:text-5xl font-black">
                  {horas}
                </p>

                <p className="text-sm md:text-lg uppercase font-bold mt-2">
                  Horas
                </p>

              </div>

              <div className="bg-blue-900 rounded-2xl p-4 md:p-5 text-center text-white shadow-xl">

                <p className="text-3xl md:text-5xl font-black">
                  {minutos}
                </p>

                <p className="text-sm md:text-lg uppercase font-bold mt-2">
                  Minutos
                </p>

              </div>

              <div className="bg-blue-900 rounded-2xl p-4 md:p-5 text-center text-white shadow-xl">

                <p className="text-3xl md:text-5xl font-black">
                  {segundos}
                </p>

                <p className="text-sm md:text-lg uppercase font-bold mt-2">
                  Segundos
                </p>

              </div>

            </div>

          </div>

          <p className="text-center text-blue-900 text-lg md:text-2xl font-bold mb-10">
            🎯 Indica el marcador exacto del partido y participa por premios oficiales.
          </p>

          {/* FORMULARIO */}

          <div className="space-y-6">

            <input
              type="text"
              placeholder="Ingresa tu cédula"
              value={cedula}
              onChange={(e) => {
                setCedula(e.target.value)
                buscarParticipante(e.target.value)
              }}
              className="w-full border-2 border-gray-300 rounded-2xl p-4 md:p-6 text-lg md:text-2xl"
            />

            <input
              type="text"
              placeholder="Ingresa tu nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-2xl p-4 md:p-6 text-lg md:text-2xl"
            />

            <input
              type="text"
              placeholder="Ingresa tu número de celular"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-2xl p-4 md:p-6 text-lg md:text-2xl"
            />

            <select
              value={lugarResidencia}
              onChange={(e) =>
                setLugarResidencia(e.target.value)
              }
              className="w-full border-2 border-gray-300 rounded-2xl p-4 md:p-6 text-lg md:text-2xl"
            >

              <option value="">
                Selecciona tu lugar de residencia
              </option>

              <option>Cabecera Municipal</option>
              <option>Surimena</option>
              <option>Pajure</option>
              <option>Palmeras</option>
              <option>Palomas</option>
              <option>Peñuelas</option>
              <option>El Barro</option>
              <option>Mi Viejo San Juan</option>
              <option>Isla Capri</option>
              <option>Giramena</option>
              <option>San José de las Palomas</option>
              <option>La Nena</option>

            </select>

          </div>

          {/* MARCADOR */}

          <div className="grid grid-cols-2 gap-4 md:gap-8 mt-10 mb-10">

            <div className="bg-yellow-50 rounded-3xl overflow-hidden shadow-xl border-2 border-yellow-300">

              <div className="bg-yellow-400 py-3 md:py-4 text-center">

                <p className="text-blue-900 text-lg md:text-3xl font-black uppercase">
                  {equipoA || 'Colombia'}
                </p>

              </div>

              <div className="p-4 md:p-6">

                <input
                  type="number"
                  value={marcadorA}
                  onChange={(e) =>
                    setMarcadorA(e.target.value)
                  }
                  placeholder="0"
                  className="w-full h-24 md:h-36 text-center text-4xl md:text-7xl font-black border-2 border-gray-300 rounded-2xl"
                />

                <p className="text-center text-sm md:text-lg text-gray-700 mt-4">
                  Goles de {equipoA || 'Colombia'}
                </p>

              </div>

            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-blue-900">

              <div className="bg-blue-900 py-3 md:py-4 text-center">

                <p className="text-white text-lg md:text-3xl font-black uppercase">
                  {equipoB || 'Japón'}
                </p>

              </div>

              <div className="p-4 md:p-6">

                <input
                  type="number"
                  value={marcadorB}
                  onChange={(e) =>
                    setMarcadorB(e.target.value)
                  }
                  placeholder="0"
                  className="w-full h-24 md:h-36 text-center text-4xl md:text-7xl font-black border-2 border-gray-300 rounded-2xl"
                />

                <p className="text-center text-sm md:text-lg text-gray-700 mt-4">
                  Goles de {equipoB || 'Japón'}
                </p>

              </div>

            </div>

          </div>

          {/* CHECKS */}

          <div className="bg-blue-50 rounded-3xl border-2 border-blue-200 p-4 md:p-8 mb-10">

            <div className="space-y-5">

              <label className="flex items-center gap-4 text-base md:text-2xl">

                <input
                  type="checkbox"
                  checked={aceptaReglamento}
                  onChange={(e) =>
                    setAceptaReglamento(e.target.checked)
                  }
                  className="w-5 h-5 md:w-6 md:h-6"
                />

                Acepto el reglamento interno

              </label>

              <label className="flex items-center gap-4 text-base md:text-2xl">

                <input
                  type="checkbox"
                  checked={aceptaDatos}
                  onChange={(e) =>
                    setAceptaDatos(e.target.checked)
                  }
                  className="w-5 h-5 md:w-6 md:h-6"
                />

                Acepto la política de tratamiento de datos

              </label>

            </div>

            <div className="text-center mt-8">

              <a
                href="#"
                className="text-blue-700 font-black underline text-lg md:text-2xl"
              >
                📄 Ver reglamento oficial
              </a>

            </div>

          </div>

          {/* BOTON */}

          <button
            onClick={guardarParticipacion}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:scale-105 transition-all text-white text-2xl md:text-5xl font-black py-5 md:py-7 rounded-3xl shadow-2xl"
          >
            🏆 PARTICIPAR
          </button>

        </div>

      </div>

    </main>
  )
}