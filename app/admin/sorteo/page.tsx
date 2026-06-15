'use client'

import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase'

import AuthGuard from '@/components/AuthGuard'
import LogoutButton from '@/components/LogoutButton'

export default function SorteoPage() {

  const [partidos, setPartidos] = useState<any[]>([])
  const [partidoId, setPartidoId] = useState('')

  const [marcadorA, setMarcadorA] = useState('')
  const [marcadorB, setMarcadorB] = useState('')

  const [acertantes, setAcertantes] = useState<any[]>([])

  const [cantidadGorras, setCantidadGorras] = useState(120)
  const [cantidadCamisas, setCantidadCamisas] = useState(15)
  const [cantidadBalones, setCantidadBalones] = useState(10)
  const [cantidadTermos, setCantidadTermos] = useState(12)

  const [ganadores, setGanadores] = useState<any>({
    Combos: [],
    Camisas: [],
    Dinero: [],
    Otros: [],
  })

  // CARGAR PARTIDOS

  const cargarPartidos = async () => {

    const { data } = await supabase
      .from('partidos')
      .select('*')
      .order('id', { ascending: false })

    setPartidos(data || [])
  }

  useEffect(() => {
    cargarPartidos()
  }, [])

  // BUSCAR ACERTANTES

  const buscarAcertantes = async () => {

    const { data, error } = await supabase
      .from('predicciones')
      .select(`
        *,
        participantes (
          nombre,
          cedula,
          celular,
          lugar_residencia
        )
      `)
      .eq('partido_id', partidoId)
      .eq('marcador_a', marcadorA)
      .eq('marcador_b', marcadorB)

    if (error) {

      console.log(error)

      alert('Error buscando acertantes')

      return
    }

    setAcertantes(data || [])

    alert(
      `Se encontraron ${data?.length || 0} acertantes`
    )
  }

  // MEZCLAR ARRAY

  const mezclarArray = (array: any[]) => {

    return [...array].sort(
      () => Math.random() - 0.5
    )
  }

  // REALIZAR SORTEO

  const realizarSorteo = () => {

    if (acertantes.length === 0) {

      alert('No hay acertantes')

      return
    }

    const mezclados = mezclarArray(acertantes)

    let indice = 0

    const seleccionar = (cantidad: number) => {

      const seleccionados = mezclados.slice(
        indice,
        indice + cantidad
      )

      indice += cantidad

      return seleccionados
    }

    const resultado = {

      gorras: seleccionar(cantidadGorras),

      camisas: seleccionar(cantidadCamisas),

      balones: seleccionar(cantidadBalones),

      termos: seleccionar(cantidadTermos),
    }

    setGanadores(resultado)

    alert('🎉 Sorteo realizado correctamente')
  }

  // TABLA

  const TablaGanadores = ({
    titulo,
    datos,
    color,
  }: any) => (

    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

      <div className={`${color} p-5 text-white text-center`}>

        <h2 className="text-3xl font-black uppercase">
          {titulo}
        </h2>

        <p className="text-xl mt-2">
          Total:
          {' '}
          {datos.length}
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Nombre
              </th>

              <th className="p-4 text-left">
                Cédula
              </th>

              <th className="p-4 text-left">
                Celular
              </th>

              <th className="p-4 text-left">
                Residencia
              </th>

            </tr>

          </thead>

          <tbody>

            {datos.map((item: any) => (

              <tr
                key={item.id}
                className="border-b hover:bg-yellow-50"
              >

                <td className="p-4">
                  {item.participantes?.nombre}
                </td>

                <td className="p-4">
                  {item.participantes?.cedula}
                </td>

                <td className="p-4">
                  {item.participantes?.celular}
                </td>

                <td className="p-4">
                  {item.participantes?.lugar_residencia}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )

  return (

    <AuthGuard>

      <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-red-700 p-10">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-10">

            <div className="bg-yellow-400 p-6">

              <div className="flex justify-end mb-4">

                <LogoutButton />

              </div>

              <div className="text-center">

                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-32 mx-auto mb-4"
                />

                <h1 className="text-5xl font-black text-blue-900 uppercase">
                  Sorteo Oficial
                </h1>

                <p className="text-red-600 text-2xl font-bold mt-2">
                  Gol y Gana con Nuestra Selección
                </p>

              </div>

            </div>

            {/* FILTRO */}

            <div className="p-8">

              <div className="grid md:grid-cols-4 gap-5 mb-8">

                <select
                  value={partidoId}
                  onChange={(e) =>
                    setPartidoId(e.target.value)
                  }
                  className="border-2 border-blue-900 rounded-2xl p-4 text-xl"
                >

                  <option value="">
                    Selecciona partido
                  </option>

                  {partidos.map((partido) => (

                    <option
                      key={partido.id}
                      value={partido.id}
                    >
                      {partido.equipo_a}
                      {' '}
                      vs
                      {' '}
                      {partido.equipo_b}
                    </option>

                  ))}

                </select>

                <input
                  type="number"
                  placeholder="Goles A"
                  value={marcadorA}
                  onChange={(e) =>
                    setMarcadorA(e.target.value)
                  }
                  className="border-2 border-blue-900 rounded-2xl p-4 text-xl"
                />

                <input
                  type="number"
                  placeholder="Goles B"
                  value={marcadorB}
                  onChange={(e) =>
                    setMarcadorB(e.target.value)
                  }
                  className="border-2 border-blue-900 rounded-2xl p-4 text-xl"
                />

                <button
                  onClick={buscarAcertantes}
                  className="bg-blue-900 text-white rounded-2xl text-2xl font-black"
                >
                  🔎 BUSCAR
                </button>

              </div>

              {/* ACERTANTES */}

              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-3xl p-6 text-center mb-8">

                <p className="text-4xl font-black text-blue-900">
                  🎯 Acertantes encontrados
                </p>

                <p className="text-6xl font-black text-red-600 mt-4">
                  {acertantes.length}
                </p>

              </div>

              {/* PREMIOS */}

              <div className="grid md:grid-cols-4 gap-5 mb-10">

                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-3xl p-5">

                  <p className="text-2xl font-black text-center text-blue-900 mb-4">
                    🧢 Gorras
                  </p>

                  <input
                    type="number"
                    value={cantidadGorras}
                    onChange={(e) =>
                      setCantidadGorras(
                        Number(e.target.value)
                      )
                    }
                    className="w-full border-2 border-blue-900 rounded-2xl p-4 text-3xl text-center font-black"
                  />

                </div>

                <div className="bg-blue-50 border-2 border-blue-300 rounded-3xl p-5">

                  <p className="text-2xl font-black text-center text-blue-900 mb-4">
                    👕 Camisas
                  </p>

                  <input
                    type="number"
                    value={cantidadCamisas}
                    onChange={(e) =>
                      setCantidadCamisas(
                        Number(e.target.value)
                      )
                    }
                    className="w-full border-2 border-blue-900 rounded-2xl p-4 text-3xl text-center font-black"
                  />

                </div>

                <div className="bg-red-50 border-2 border-red-300 rounded-3xl p-5">

                  <p className="text-2xl font-black text-center text-blue-900 mb-4">
                    ⚽ Balones
                  </p>

                  <input
                    type="number"
                    value={cantidadBalones}
                    onChange={(e) =>
                      setCantidadBalones(
                        Number(e.target.value)
                      )
                    }
                    className="w-full border-2 border-blue-900 rounded-2xl p-4 text-3xl text-center font-black"
                  />

                </div>

                <div className="bg-gray-50 border-2 border-gray-300 rounded-3xl p-5">

                  <p className="text-2xl font-black text-center text-blue-900 mb-4">
                    🧃 Termos
                  </p>

                  <input
                    type="number"
                    value={cantidadTermos}
                    onChange={(e) =>
                      setCantidadTermos(
                        Number(e.target.value)
                      )
                    }
                    className="w-full border-2 border-blue-900 rounded-2xl p-4 text-3xl text-center font-black"
                  />

                </div>

              </div>

              {/* BOTON */}

              <button
                onClick={realizarSorteo}
                className="w-full bg-gradient-to-r from-yellow-400 via-red-500 to-blue-900 text-white text-4xl font-black py-6 rounded-3xl shadow-2xl hover:scale-105 transition-all"
              >
                🎉 REALIZAR SORTEO
              </button>

            </div>

          </div>

          {/* RESULTADOS */}

          <div className="grid gap-10">

            <TablaGanadores
              titulo="Ganadores Gorras"
              datos={ganadores.gorras}
              color="bg-yellow-500"
            />

            <TablaGanadores
              titulo="Ganadores Camisas"
              datos={ganadores.camisas}
              color="bg-blue-900"
            />

            <TablaGanadores
              titulo="Ganadores Balones"
              datos={ganadores.balones}
              color="bg-red-600"
            />

            <TablaGanadores
              titulo="Ganadores Termos"
              datos={ganadores.termos}
              color="bg-gray-700"
            />

          </div>

        </div>

      </main>

    </AuthGuard>
  )
}