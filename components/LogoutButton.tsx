'use client'

import { supabase } from '@/lib/supabase'

export default function LogoutButton() {

  const cerrarSesion = async () => {

    await supabase.auth.signOut()

    window.location.href = '/login'
  }

  return (

    <button
      onClick={cerrarSesion}
      className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl text-xl font-black shadow-xl transition-all hover:scale-105"
    >
      🔐 Cerrar sesión
    </button>
  )
}