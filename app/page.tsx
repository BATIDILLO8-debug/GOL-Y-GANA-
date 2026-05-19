'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function Home() {

  const [cedula, setCedula] = useState('')
  const [nombre, setNombre] = useState('')
  const [celular, setCelular] = useState('')
  const [lugarResidencia, setLugarResidencia] = useState('')
  const [otroLugar, setOtroLugar] = useState('')

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

  const [mostrarReglamento, setMostrarReglamento] = useState(false)

  const [mostrarExito, setMostrarExito] = useState(false)
  const [codigoGenerado, setCodigoGenerado] = useState('')

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

    if (
      !cedula ||
      !nombre ||
      !celular ||
      !lugarResidencia
    ) {

      alert('Completa todos los campos.')

      return
    }

    if (celular.length !== 10) {

      alert('El celular debe tener 10 dígitos.')

      return
    }

    if (
      marcadorA === '' ||
      marcadorB === ''
    ) {

      alert('Debes indicar el marcador.')

      return
    }

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
            lugar_residencia:
              lugarResidencia === 'OTROS'
                ? otroLugar
                : lugarResidencia,
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
          marcador_a: Number(marcadorA),
          marcador_b: Number(marcadorB),
          latitud: latitud,
          longitud: longitud,
        },
      ])

    if (error) {

      console.log(error)

      alert('Error guardando participación')

      return
    }

    setCodigoGenerado(codigo)

    setMostrarExito(true)

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

      {/* MODAL REGLAMENTO */}

      {
        mostrarReglamento && (

          <div className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center p-4">

            <div className="bg-white rounded-3xl p-6 md:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">

              <h2 className="text-3xl md:text-5xl font-black text-blue-900 text-center mb-6">
                📄 Reglamento Oficial
              </h2>

              <div className="space-y-4 text-gray-700 text-sm md:text-lg">

                <p>
                  • Solo podrán participar mayores de edad.
                </p>

                <p>
                  • Solo se permite una participación por partido por número de cédula.
                </p>

                <p>
                  • El participante acepta el tratamiento de datos personales.
                </p>

                <p>
                  • El premio será entregado únicamente al titular registrado.
                </p>

                <p>
                  • Los resultados oficiales serán publicados por la organización.
                </p>

                <p>
                  • La participación implica aceptación total del reglamento.
                </p>

              </div>

              <button
                onClick={() =>
                  setMostrarReglamento(false)
                }
                className="mt-8 w-full bg-blue-900 text-white py-4 rounded-2xl font-black text-xl"
              >
                CERRAR
              </button>

            </div>

          </div>

        )
      }

      {/* MODAL EXITO */}

      {
        mostrarExito && (

          <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center p-4">

            <div className="bg-white rounded-[35px] p-6 md:p-10 max-w-xl w-full text-center shadow-2xl">

              <div className="flex justify-center mb-5">

                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={180}
                  height={180}
                  className="w-32 md:w-44 h-auto"
                />

              </div>

              <h2 className="text-3xl md:text-5xl font-black text-blue-900 uppercase">
                ✅ Registro Exitoso
              </h2>

              <p className="mt-5 text-lg md:text-2xl text-gray-700">
                Participante:
              </p>

              <p className="text-2xl md:text-4xl font-black text-red-600 uppercase mt-2">
                {nombre}
              </p>

              <p className="mt-6 text-lg md:text-2xl text-gray-700">
                Tu código oficial es:
              </p>

              <div className="bg-yellow-400 text-blue-900 text-5xl md:text-7xl font-black rounded-3xl py-6 mt-4 shadow-xl">
                {codigoGenerado}
              </div>

              <div className="mt-8 text-gray-500 text-sm md:text-lg leading-relaxed">

                <p className="font-black uppercase">
                  Amor por lo Nuestro
                </p>

                <p>
                  Una iniciativa de Erik Dimingo
                </p>

                <p>
                  Porque la selección nos une 🇨🇴
                </p>

              </div>

              <button
                onClick={() =>
                  setMostrarExito(false)
                }
                className="mt-8 w-full bg-blue-900 text-white py-4 rounded-2xl font-black text-xl"
              >
                FINALIZAR
              </button>

            </div>

          </div>

        )
      }

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

        </div>

        {/* CONTENIDO */}

        <div className="p-4 md:p-8">

          <p className="text-center text-blue-900 text-lg md:text-2xl font-bold mb-8">
            Registra tu número de cédula de ciudadanía, nombre y apellidos, celular y lugar de domicilio.
          </p>

          {/* FORMULARIO */}

          <div className="space-y-4">

            <input
              type="text"
              placeholder="Número de cédula"
              value={cedula}
              onChange={(e) => {

                const valor =
                  e.target.value.replace(/\D/g, '')

                setCedula(valor)

                buscarParticipante(valor)
              }}
              className="w-full border-2 border-gray-300 rounded-2xl p-4 text-lg"
            />

            <input
              type="text"
              placeholder="Nombre y apellidos"
              value={nombre}
              onChange={(e) =>
                setNombre(e.target.value)
              }
              className="w-full border-2 border-gray-300 rounded-2xl p-4 text-lg"
            />

            <input
              type="text"
              placeholder="Celular"
              value={celular}
              maxLength={10}
              onChange={(e) => {

                const valor =
                  e.target.value.replace(/\D/g, '')

                setCelular(valor)
              }}
              className="w-full border-2 border-gray-300 rounded-2xl p-4 text-lg"
            />

            <select
              value={lugarResidencia}
              onChange={(e) =>
                setLugarResidencia(e.target.value)
              }
              className="w-full border-2 border-gray-300 rounded-2xl p-4 text-lg"
            >

              <option value="">
                Lugar de residencia
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
              <option>OTROS</option>

            </select>

            {
              lugarResidencia === 'OTROS' && (

                <input
                  type="text"
                  placeholder="Escribe tu lugar de residencia"
                  value={otroLugar}
                  onChange={(e) =>
                    setOtroLugar(e.target.value)
                  }
                  className="w-full border-2 border-gray-300 rounded-2xl p-4 text-lg"
                />

              )
            }

          </div>

          {/* TEXTO MARCADOR */}

          <p className="text-center text-blue-900 text-lg md:text-2xl font-bold mt-10 mb-8">
            🎯 Indica el marcador exacto del partido y participa por premios oficiales.
          </p>

          {/* MARCADOR */}

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-yellow-50 rounded-3xl overflow-hidden shadow-xl border-2 border-yellow-300">

              <div className="bg-yellow-400 py-3 text-center">

                <p className="text-blue-900 text-lg md:text-3xl font-black uppercase">
                  {equipoA || 'Colombia'}
                </p>

              </div>

              <div className="p-4">

                <input
                  type="number"
                  min="0"
                  value={marcadorA}
                  onChange={(e) => {

                    if (
                      Number(e.target.value) < 0
                    ) return

                    setMarcadorA(e.target.value)
                  }}
                  placeholder="0"
                  className="w-full h-24 text-center text-5xl font-black border-2 border-gray-300 rounded-2xl"
                />

              </div>

            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-blue-900">

              <div className="bg-blue-900 py-3 text-center">

                <p className="text-white text-lg md:text-3xl font-black uppercase">
                  {equipoB || 'Japón'}
                </p>

              </div>

              <div className="p-4">

                <input
                  type="number"
                  min="0"
                  value={marcadorB}
                  onChange={(e) => {

                    if (
                      Number(e.target.value) < 0
                    ) return

                    setMarcadorB(e.target.value)
                  }}
                  placeholder="0"
                  className="w-full h-24 text-center text-5xl font-black border-2 border-gray-300 rounded-2xl"
                />

              </div>

            </div>

          </div>

          {/* CHECKS */}

          <div className="bg-blue-50 rounded-3xl border-2 border-blue-200 p-4 md:p-8 mt-10 mb-8">

            <div className="space-y-6">

              <label className="flex items-start gap-3 text-sm md:text-xl text-gray-800 font-semibold">

                <input
                  type="checkbox"
                  checked={aceptaReglamento}
                  onChange={(e) =>
                    setAceptaReglamento(e.target.checked)
                  }
                  className="w-5 h-5 mt-1"
                />

                <span>
                  Acepto el reglamento interno
                </span>

              </label>

              <label className="flex items-start gap-3 text-sm md:text-xl text-gray-800 font-semibold">

                <input
                  type="checkbox"
                  checked={aceptaDatos}
                  onChange={(e) =>
                    setAceptaDatos(e.target.checked)
                  }
                  className="w-5 h-5 mt-1"
                />

                <span>
                  Acepto la política de tratamiento de datos
                </span>

              </label>

            </div>

            <div className="text-center mt-6">

              <button
                onClick={() =>
                  setMostrarReglamento(true)
                }
                className="text-blue-700 font-black underline text-lg md:text-2xl"
              >
                📄 Ver reglamento oficial
              </button>

            </div>

          </div>

          {/* BOTON */}

          <button
            onClick={guardarParticipacion}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:scale-105 transition-all text-white text-2xl md:text-5xl font-black py-5 rounded-3xl shadow-2xl"
          >
            🏆 PARTICIPAR
          </button>

        </div>

      </div>

    </main>
  )
}