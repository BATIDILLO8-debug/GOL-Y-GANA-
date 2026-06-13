'use client'

import { useEffect, useState } from 'react'

export default function InstallAppButton() {

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {

    const handler = (e: any) => {

      e.preventDefault()

      setDeferredPrompt(e)

    }

    window.addEventListener(
      'beforeinstallprompt',
      handler
    )

    return () => {

      window.removeEventListener(
        'beforeinstallprompt',
        handler
      )

    }

  }, [])

  const instalar = async () => {

    if (!deferredPrompt) {

      alert(
        'La instalación no está disponible todavía. Intenta abrir la aplicación desde Chrome en Android.'
      )

      return
    }

    deferredPrompt.prompt()

    await
    const result = await deferredPrompt.userChoice

if (result.outcome === 'accepted') {

  console.log('App instalada')

}

setDeferredPrompt(null)

}

if (!deferredPrompt) return null

return (

  <button
    onClick={instalar}
    className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl text-xl shadow-xl"
  >
    📲 INSTALAR APP
  </button>

)

}