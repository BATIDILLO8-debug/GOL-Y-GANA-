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
    'Para instalar la aplicación abre el menú de Chrome y selecciona "Agregar a pantalla principal".'
  )

  return
}

deferredPrompt.prompt()

const result =
  await deferredPrompt.userChoice

if (
  result.outcome === 'accepted'
) {

  console.log('App instalada')

}

setDeferredPrompt(null)


}

return (


<div className="space-y-3">

  <button
    onClick={instalar}
    className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-2xl text-xl shadow-xl"
  >
    📲 DESCARGAR / INSTALAR APP
  </button>

  <p className="text-sm text-gray-600">
    Instala la aplicación para consultar ganadores,
    resultados y próximos sorteos.
  </p>

</div>


)

}
