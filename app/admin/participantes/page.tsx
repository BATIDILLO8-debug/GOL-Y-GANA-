'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import AuthGuard from '@/components/AuthGuard'

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

export default function ParticipantesPage() {

  const [participaciones, setParticipaciones] = useState<any[]>([])

  const cargarParticipaciones = async () => {

    const { data, error } = await supabase
      .from('predicciones')
      .select(`
        *,
        participantes (
          nombre,
          cedula,
          celular,
          lugar_residencia
        ),
        partidos (
          equipo_a,
          equipo_b
        )
      `)
      .order('id', { ascending: false })

    if (error) {

      console.log(error)
      return
    }

    setParticipaciones(data || [])
  }

  useEffect(() => {
    cargarParticipaciones()
  }, [])

  const exportarExcel = () => {

    const datos = participaciones.map((item) => ({

      Nombre: item.participantes?.nombre,

      Cedula: item.participantes?.cedula,

      Celular: item.participantes?.celular,

      Residencia: item.participantes?.lugar_residencia,

      Partido:
        `${item.partidos?.equipo_a} vs ${item.partidos?.equipo_b}`,

      Marcador:
        `${item.marcador_a} - ${item.marcador_b}`,

      Latitud: item.latitud,

      Longitud: item.longitud,

    }))

    const hoja = XLSX.utils.json_to_sheet(datos)

    const libro = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      libro,
      hoja,
      'Participantes'
    )

    const excelBuffer = XLSX.write(libro, {
      bookType: 'xlsx',
      type: 'array',
    })

    const data = new Blob(
      [excelBuffer],
      {
        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      }
    )

    saveAs(data, 'participantes.xlsx')
  }

  return (

    <AuthGuard>

      <main className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-red-700 p-8">

        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

          <div className="bg-yellow-400 p-6">

            <h1 className="text-5xl font-black text-center text-blue-900 uppercase">
              Participantes
            </h1>

            <p className="text-center text-red-600 text-2xl font-bold mt-2">
              Gol y Gana con Nuestra Selección
            </p>

          </div>

          <div className="p-6 bg-gray-100 border-b flex justify-end">

            <button
              onClick={exportarExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-5 rounded-2xl text-2xl font-black shadow-xl transition-all hover:scale-105"
            >
              📥 EXPORTAR EXCEL
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-blue-900 text-white">

                <tr>

                  <th className="p-5 text-left text-xl">
                    Nombre
                  </th>

                  <th className="p-5 text-left text-xl">
                    Cédula
                  </th>

                  <th className="p-5 text-left text-xl">
                    Celular
                  </th>

                  <th className="p-5 text-left text-xl">
                    Residencia
                  </th>

                  <th className="p-5 text-left text-xl">
                    Partido
                  </th>

                  <th className="p-5 text-left text-xl">
                    Marcador
                  </th>

                </tr>

              </thead>

              <tbody>

                {participaciones.map((item) => (

                  <tr
                    key={item.id}
                    className="border-b hover:bg-yellow-50"
                  >

                    <td className="p-5 text-lg">
                      {item.participantes?.nombre}
                    </td>

                    <td className="p-5 text-lg">
                      {item.participantes?.cedula}
                    </td>

                    <td className="p-5 text-lg">
                      {item.participantes?.celular}
                    </td>

                    <td className="p-5 text-lg">
                      {item.participantes?.lugar_residencia}
                    </td>

                    <td className="p-5 text-lg font-bold text-blue-900">
                      {item.partidos?.equipo_a} vs {item.partidos?.equipo_b}
                    </td>

                    <td className="p-5 text-3xl font-black text-red-600">
                      {item.marcador_a} - {item.marcador_b}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

    </AuthGuard>
  )
}