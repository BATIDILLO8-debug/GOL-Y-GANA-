'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const verificarSesion =
      async () => {

        const {
          data,
          error,
        } = await supabase.auth.getUser()

        if (
          error ||
          !data.user
        ) {

          window.location.href =
            '/login'

          return

        }

        setLoading(false)

      }

    verificarSesion()

  }, [])

  if (loading) {

    return (

      <main className="min-h-screen flex items-center justify-center bg-blue-950">

        <p className="text-white text-4xl font-black">

          Verificando sesión...

        </p>

      </main>

    )

  }

  return <>{children}</>

}