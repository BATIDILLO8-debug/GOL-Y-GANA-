import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
metadataBase: new URL('https://gol-y-gana.vercel.app'),

title: 'Gol y Gana con Nuestra Selección',

description:
'Participa y gana con nuestra selección. Registra tu marcador y participa por premios oficiales.',

applicationName: 'Gol y Gana',

manifest: '/manifest.json',

openGraph: {
title: 'Gol y Gana con Nuestra Selección',


description:
  'Participa y gana con nuestra selección. Registra tu marcador y participa por premios oficiales.',

url: 'https://gol-y-gana.vercel.app',

siteName: 'Gol y Gana, una iniciativa de ERIK DIMINGO',

locale: 'es_CO',

type: 'website',

images: [
  {
    url: 'https://gol-y-gana.vercel.app/social-share.png',
    width: 1200,
    height: 630,
    alt: 'Gol y Gana con Nuestra Selección',
  },
],


},

twitter: {
card: 'summary_large_image',


title: 'Gol y Gana con Nuestra Selección',

description:
  'Participa y gana con nuestra selección. Registra tu marcador y participa por premios oficiales.',

images: [
  'https://gol-y-gana.vercel.app/social-share.png',
],


},

icons: {
icon: '/icon-192.png',
apple: '/icon-192.png',
shortcut: '/icon-192.png',
},
}

export const viewport: Viewport = {
themeColor: '#002B7F',
}

export default function RootLayout({
children,
}: {
children: React.ReactNode
}) {
return ( <html lang="es"> <body>{children}</body> </html>
)
}
