'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import InstallAppButton from '@/components/InstallAppButton'
import { registrarPush } from '@/lib/push'

export default function Home() {
  const [appInstalada, setAppInstalada] =
  useState(false)

const [mostrarInstalacion, setMostrarInstalacion] =
  useState(false)

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
  const [referidoPor, setReferidoPor] = useState('')
  const [codigoReferido, setCodigoReferido] = useState('')
  const [mostrarReferidos, setMostrarReferidos] = useState(false)
  const [campaniaActiva, setCampaniaActiva] = useState<any>(null)
  const [progresoReferidos, setProgresoReferidos] =
  useState(0)
  const [ranking, setRanking] = useState<any[]>([])
const [posicionRanking, setPosicionRanking] =
  useState<number | null>(null)
  

const [cedulaReferido, setCedulaReferido] = useState('')

const [datosReferido, setDatosReferido] = useState<any>(null)

const [totalReferidos, setTotalReferidos] = useState(0)

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

// CARGAR CAMPAÑA

const cargarCampania = async () => {

  const { data, error } = await supabase
    .from('campanias_referidos')
    .select('*')
    .eq('activa', true)
    .single()

  if (error) {

    console.log(error)
    return

  }

  setCampaniaActiva(data)

}

useEffect(() => {

  cargarPartido()
  cargarCampania()
  registrarPush()

  const esAndroid =
    /Android/i.test(
      navigator.userAgent
    )

  const instalada =
    window.matchMedia(
      '(display-mode: standalone)'
    ).matches

  if (
    esAndroid &&
    !instalada
  ) {

    setMostrarInstalacion(true)

  }

  const params =
    new URLSearchParams(
      window.location.search
    )

  const ref =
    params.get('ref')

    console.log('REF URL:', ref)

  if (ref) {

    setReferidoPor(ref)

    localStorage.setItem(
      'referido',
      ref
    )
  console.log(
    'REFERIDO GUARDADO:',
    localStorage.getItem('referido')
  )

  }

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

          const referidoPor =
    localStorage.getItem(
      'referido'
    )

    console.log(
  'REFERIDO AL REGISTRAR:',
  referidoPor
)
    const esAndroid =
  /Android/i.test(
    navigator.userAgent
  )

const instalada =
  window.matchMedia(
    '(display-mode: standalone)'
  ).matches

if (
  esAndroid &&
  !instalada
) {

  setMostrarInstalacion(true)

  return

}

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
const codigoReferidoNuevo = crypto
  .randomUUID()
  .replace(/-/g, '')
  .substring(0, 8)
  .toUpperCase()

      const { data, error } = await supabase
        .from('participantes')
        .insert([
          {
            cedula,
            nombre,
            celular,
              codigo_referido:
    codigoReferidoNuevo,

  referido_por:
    referidoPor || null,
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
      setCodigoReferido(
  codigoReferidoNuevo
)

    } else {

       participanteId =participanteExistente.id

  setCodigoReferido(    participanteExistente.codigo_referido)
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
 localStorage.removeItem(
  'referido'
)
    setMarcadorA('')
    setMarcadorB('')
  }


const compartirWhatsapp = () => {

   const codigo =
    datosReferido?.codigo_referido || codigoReferido

  if (!codigo) {

    alert('No se encontró el código de referido')
    return

  }

  const link =
    `${window.location.origin}/?ref=${codigo}`

  const mensaje =
`🏆 GOL Y GANA CON NUESTRA SELECCIÓN

⚽ Participa y gana premios pronosticando el marcador.

🎁 Regístrate gratis aquí:

${link}

📲 Invitación enviada por un participante oficial.`

  window.open(
    `https://wa.me/?text=${encodeURIComponent(mensaje)}`,
    '_blank'
  )

}
const consultarReferidos = async () => {

  if (!cedulaReferido) {

    alert('Ingrese una cédula')
    return

  }

  const { data } = await supabase
    .from('participantes')
    .select('*')
    .eq('cedula', cedulaReferido)
    .single()

  if (!data) {

    alert('Participante no encontrado, primero debes participar dejando tu marcador, para poder compartir')
    return

  }
alert(
  `Nombre: ${data.nombre}
Codigo: ${data.codigo_referido}`
)


  setDatosReferido(data)
await cargarRanking(
  data.codigo_referido
)
  const { count } = await supabase
    .from('participantes')
    .select('*', {
      count: 'exact',
      head: true,
    })
    .eq(
      'referido_por',
      data.codigo_referido
    )

  setTotalReferidos(count || 0)
  const progreso =

  campaniaActiva

    ? Math.min(

        100,

        Math.round(

          ((count || 0) /

            campaniaActiva.meta_referidos) *

            100

        )

      )

    : 0
 setProgresoReferidos(progreso)
}
const cargarRanking = async (
  codigoUsuario?: string
) => {

  const { data } = await supabase
    .from('participantes')
    .select('nombre,codigo_referido')

  if (!data) return

  const rankingTemp = []

  for (const participante of data) {

    const { count } = await supabase
      .from('participantes')
      .select('*', {
        count: 'exact',
        head: true,
      })
      .eq(
        'referido_por',
        participante.codigo_referido
      )

    rankingTemp.push({
      nombre: participante.nombre,
      codigo:
        participante.codigo_referido,
      total: count || 0,
    })

  }

  rankingTemp.sort(
    (a, b) => b.total - a.total
  )

  setRanking(
    rankingTemp.slice(0, 10)
  )

  if (codigoUsuario) {

    const posicion =
      rankingTemp.findIndex(
        item =>
          item.codigo === codigoUsuario
      ) + 1

    setPosicionRanking(posicion)

  }

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
{/* MODAL INSTALACION */}

{mostrarInstalacion && (

  <div className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center p-4">

    <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center">

      <h2 className="text-3xl font-black text-blue-900">

        📲 INSTALA LA APP

      </h2>

      <p className="mt-4 text-gray-700">

        Para participar debes instalar la aplicación oficial.

      </p>

      <div className="mt-5 text-left space-y-3 text-gray-900 font-bold">

        <p>✅ Nuevos partidos</p>

        <p>✅ Resultados oficiales</p>

        <p>✅ Ganadores</p>

        <p>✅ Premios especiales</p>

        <p>✅ Notificaciones push</p>

      </div>

      <div className="mt-6">

        <InstallAppButton />

      </div>

      <p className="mt-4 text-sm text-gray-900">

        Después de instalar, vuelve a abrir la aplicación desde tu pantalla principal.

      </p>

    </div>

  </div>

)}
      {/* MODAL REGLAMENTO */}

      {
        mostrarReglamento && (

          <div className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center p-4">

            <div className="bg-white rounded-3xl p-6 md:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto">

              <h2 className="text-2xl md:text-5xl font-black text-blue-900 text-center mb-6">
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
{/* MODAL COMPARTE Y GANA */}

{mostrarReferidos && (

  <div className="fixed inset-0 z-[9999] bg-black/90 overflow-y-auto p-4">

   <div className="bg-white rounded-3xl p-6 md:p-10 w-full max-w-md mx-auto my-6 shadow-2xl">

      <h2 className="text-3xl md:text-5xl font-black text-center text-green-700 mb-4">
        🎁 ¡COMPARTE Y GANA!
      </h2>

      <p className="text-center text-gray-900 mb-6">
        ingresa tu cedula, podras compartir y ganar muchos premios.
      </p>

     <input
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  placeholder="Ingrese su cédula"
  value={cedulaReferido}
  onChange={(e) =>
    setCedulaReferido(e.target.value)
  }
  className="w-full border-4 border-black rounded-3xl p-5 text-3xl font-black text-black placeholder:text-gray-400 bg-white "
/>

      <button
        onClick={consultarReferidos}
        className="w-full mt-4 bg-blue-900 text-white font-black py-3 rounded-2xl"
      >
     🔍 CONSULTAR
</button>

{datosReferido && (

  <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-3">

    <p className="text-blue-900 text-lg font-black">
      {datosReferido.nombre}
    </p>

    <p className="mt-4 text-gray-700 font-bold">
      👥 Referidos registrados
    </p>

    <div className="bg-blue-900 text-white text-3xl font-black rounded-2xl py-3 mt-2 text-center">
      {totalReferidos}
    </div>

    {posicionRanking && (

      <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-xl p-3">

        <p className="font-black text-yellow-800 text-center">
          🏆 Tu posición en el ranking: #{posicionRanking}
        </p>

      </div>

    )}

    {campaniaActiva && (

      <div className="mt-4">

        <p className="text-sm font-bold text-gray-700">
          🎯 Meta: {campaniaActiva.meta_referidos} referidos
        </p>

        <div className="w-full bg-gray-200 rounded-full h-5 mt-2 overflow-hidden">

          <div
            className="bg-green-600 h-5 transition-all duration-500"
            style={{
              width: `${progresoReferidos}%`
            }}
          />

        </div>

        <p className="font-black text-green-700 mt-2 text-center">
          {progresoReferidos}% completado
        </p>

      </div>

    )}

    {campaniaActiva && (

  <div className="mt-4 bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4">

    <h3 className="text-center text-xl font-black text-yellow-700 mb-3">

      🎁 {campaniaActiva.nombre}

    </h3>

    {campaniaActiva.imagen && (

      <img
        src={campaniaActiva.imagen}
        alt="Premio"
        className="w-full rounded-2xl mb-3"
      />

    )}

    <p className="text-gray-700 text-center mb-3">

      {campaniaActiva.descripcion}

    </p>

    <div className="bg-white rounded-xl p-3 border">

      <p className="font-black text-green-700">

        🎁 Premio

      </p>

      <p className="text-black font-black text-xl">
        {campaniaActiva.premio}
      </p>

    </div>

    <div className="bg-white rounded-xl p-3 border mt-3">

      <p className="font-black text-blue-700">

        🏪 Patrocinador

      </p>

      <p className="text-black font-black text-xl">
        {campaniaActiva.patrocinador}
      </p>

    </div>

    <div className="bg-white rounded-xl p-3 border mt-3">

      <p className="font-black text-red-700">

        📅 Finaliza

      </p>

      <p className="text-black font-black text-xl">

        {new Date(
          campaniaActiva.fecha_fin
        ).toLocaleDateString()}

      </p>

    </div>

  </div>

)}
       <button
      onClick={compartirWhatsapp}
      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl"
    >
     
      🟢 COMPARTIR POR WHATSAPP
    </button>

  </div>

)}
{ranking.length > 0 && (

 <div className="mt-6 bg-white border-2 border-yellow-300 rounded-2xl p-4 max-h-[400px] overflow-y-auto">

    <h3 className="text-xl font-black text-center text-yellow-700 mb-4">

      🏆 TOP PROMOTORES

    </h3>

    {ranking.map((item, index) => (

      <div
        key={index}
        className="flex justify-between items-center border-b py-2"
      >

        <div>

  <div className="text-xl font-black text-blue-900">

    {index === 0 && '🥇'}
    {index === 1 && '🥈'}
    {index === 2 && '🥉'}

    {index > 2 && `#${index + 1}`}

  </div>

  <div className="truncate max-w-[220px] text-black font-bold">

    {item.nombre}

  </div>

</div>

        <div className="font-black text-blue-900">

          {item.total}

        </div>

      </div>

    ))}

  </div>

)}
<button
  onClick={() => {

    document.body.style.overflow = 'auto'

    setMostrarReferidos(false)

  }}
  className="w-full mt-4 bg-red-600 text-white font-black py-4 rounded-2xl"
>
  CERRAR
</button>

    </div>

  </div>

)}
      {/* MODAL EXITO */}

{mostrarExito && (

<div className="fixed inset-0 z-50 bg-black/80 overflow-y-auto p-4 flex justify-center items-start">

  <div className="bg-white rounded-[35px] p-5 md:p-10 max-w-xl w-full text-center shadow-2xl max-h-[90vh] overflow-y-auto">

    <div className="flex justify-center mb-5">

      <Image
        src="/logo.png"
        alt="Logo"
        width={180}
        height={180}
        className="w-32 md:w-44 h-auto"
      />

    </div>

    <h2 className="text-2xl md:text-5xl font-black text-blue-900 uppercase">
      ✅ Registro Exitoso
    </h2>

  <p className="mt-5 text-lg md:text-2xl text-gray-700">
    Participante:
  </p>

  <p className="text-2xl md:text-4xl font-black text-red-600 uppercase mt-2">
    {nombre}
  </p>

  <p className="mt-6 text-lg md:text-2xl text-gray-700">
    Tu código de participación es:
  </p>

  <div className="bg-yellow-400 text-blue-900 text-3xl md:text-6xl font-black rounded-3xl py-6 mt-4 shadow-xl">
    {codigoGenerado}
  </div>

  <div className="mt-6">

<p className="text-lg md:text-2xl text-gray-700 font-bold">
  👥 Tu código de referido
</p>

<div className="bg-green-600 text-white text-3xl md:text-5xl font-black rounded-3xl py-4 mt-2 shadow-xl">
  {codigoReferido}
</div>


  </div>

  <div className="mt-6 bg-green-50 border-2 border-green-300 rounded-2xl p-5">


<h3 className="text-green-700 text-2xl font-black">
  🎁 ¡COMPARTE Y GANA!
</h3>

<p className="text-gray-700 mt-3 text-base md:text-lg">
  Comparte tu enlace con amigos y familiares.
  Próximamente podrás ganar premios especiales,
  recargas y bonos patrocinados por nuestros aliados.
</p>

<button
  onClick={compartirWhatsapp}
  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-2xl text-lg shadow-xl"
>
  🟢 COMPARTIR POR WHATSAPP
</button>

</div>


  <div className="mt-6 bg-red-50 border-2 border-red-300 rounded-2xl p-5">


<p className="text-red-700 text-lg md:text-2xl font-black">
  ⚠️ Guarda tu código de participación
</p>

<p className="text-gray-700 mt-3 text-sm md:text-lg">
  Será solicitado para consultar resultados,
  verificar ganadores y reclamar premios.
</p>


  </div>

  <div className="mt-6">


<div className="text-gray-700 text-sm md:text-lg space-y-1 mb-6">

  <p>• Consulta ganadores</p>
  <p>• Consulta resultados</p>
  <p>• Consulta nuevos partidos</p>
  <p>• Participa en próximos sorteos</p>

</div>

<InstallAppButton />


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
onClick={() => {


  setMostrarExito(false)

  setCedula('')
  setNombre('')
  setCelular('')
  setLugarResidencia('')
  setOtroLugar('')

  setMarcadorA('')
  setMarcadorB('')

  setAceptaDatos(false)
  setAceptaReglamento(false)

}}
className="mt-6 w-full bg-blue-900 text-white py-3 rounded-2xl font-black text-lg"
>

FINALIZAR


  </button>
  </div>
</div>
   
)}
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

  <div className="bg-blue-900 text-white rounded-3xl p-4 md:p-6 mb-8">

    <p className="text-center font-black text-lg md:text-3xl mb-4">
      ⏳ Tiempo restante para participar
    </p>

    <div className="grid grid-cols-4 gap-3 text-center">

      <div>
        <p className="text-2xl md:text-5xl font-black">
          {dias}
        </p>
        <p>Días</p>
      </div>

      <div>
        <p className="text-2xl md:text-5xl font-black">
          {horas}
        </p>
        <p>Horas</p>
      </div>

      <div>
        <p className="text-2xl md:text-5xl font-black">
          {minutos}
        </p>
        <p>Min</p>
      </div>

      <div>
        <p className="text-2xl md:text-5xl font-black">
          {segundos}
        </p>
        <p>Seg</p>
      </div>

    </div>

  </div>
            <div className="bg-red-600 text-white p-4 rounded-2xl mb-4 text-center font-black">
  FECHA CIERRE: {fechaCierre}
</div>

                <p className="text-center text-blue-900 text-lg md:text-2xl font-bold mb-8">
                  Registra tu número de cédula de ciudadanía, nombre y apellidos, celular y lugar de domicilio.
                </p>

                {/* FORMULARIO */}

                <div className="space-y-4">

                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Número de cédula"
                    value={cedula}
                    onChange={(e) => {

                      const valor =
                        e.target.value.replace(/\D/g, '')

                      setCedula(valor)

                      buscarParticipante(valor)
                    }}
                    className="w-full border-2 border-gray-400 rounded-2xl p-5 text-xl font-semibold text-black placeholder:text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Nombre y apellidos"
                    value={nombre}
                    onChange={(e) =>
                      setNombre(e.target.value)
                    }
                    className="w-full border-2 border-gray-400 rounded-2xl p-5 text-xl font-semibold text-black placeholder:text-gray-400"
                  />

                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Celular"
                    value={celular}
                    maxLength={10}
                    onChange={(e) => {

                      const valor =
                        e.target.value.replace(/\D/g, '')

                      setCelular(valor)
                    }}
                    className="w-full border-2 border-gray-400 rounded-2xl p-5 text-xl font-semibold text-black placeholder:text-gray-400"
                  />

                  <select
                    value={lugarResidencia}
                    onChange={(e) =>
                      setLugarResidencia(e.target.value)
                    }
                    className="w-full border-2 border-gray-400 rounded-2xl p-5 text-xl font-semibold text-gray-700"
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
                        className="w-full border-2 border-gray-400 rounded-2xl p-5 text-xl font-semibold text-black placeholder:text-gray-400"
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
                        placeholder=""
                        className="w-full h-28 md:h-32 text-center text-6xl md:text-7xl font-black text-black border-2 border-gray-400 rounded-2xl bg-white"
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
                        placeholder=""
                        className="w-full h-28 md:h-32 text-center text-6xl md:text-7xl font-black text-black border-2 border-gray-400 rounded-2xl bg-white"
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
<button
onClick={() => {

  document.body.style.overflow = 'hidden'

  setMostrarReferidos(true)

}}
  className="w-full mt-4 bg-gradient-to-r from-green-600 to-green-500 hover:scale-105 transition-all text-white text-2xl md:text-4xl font-black py-5 rounded-3xl shadow-2xl"
>
  🎁 ¡COMPARTE Y GANA!
</button>
              </div>

            </div>
            
          </main>
)
      }