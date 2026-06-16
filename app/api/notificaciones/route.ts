import { NextResponse } from 'next/server'

import { messaging } from '@/lib/firebase-admin'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json()

    const titulo =
      body.titulo

    const mensaje =
      body.mensaje

    if (!titulo || !mensaje) {

      return NextResponse.json({

        success: false,

        error:
          'Título y mensaje requeridos'

      })

    }

    const { data: tokens, error } =
      await supabase
        .from('push_subscriptions')
        .select('token')

    if (error) {

      console.error(error)

      return NextResponse.json({

        success: false,

        error:
          'Error consultando tokens'

      })

    }

    if (!tokens?.length) {

      return NextResponse.json({

        success: false,

        error:
          'No existen dispositivos registrados'

      })

    }

    let enviados = 0
    let errores = 0

    for (const item of tokens) {

      try {

        const response =
          await messaging.send({

            token:
              item.token,

            notification: {

              title:
                titulo,

              body:
                mensaje

            },

            webpush: {

              notification: {

                title:
                  titulo,

                body:
                  mensaje,

                icon:
                  '/icon-192.png',

                badge:
                  '/icon-192.png',

                requireInteraction:
                  true

              }

            }

          })

        console.log(
          'FCM OK:',
          response
        )

        enviados++

      } catch (error) {

        console.error(
          'FCM ERROR:',
          error
        )

        errores++

      }

    }

    return NextResponse.json({

      success: true,

      enviados,

      errores,

      total:
        tokens.length

    })

  } catch (error) {

    console.error(error)

    return NextResponse.json({

      success: false,

      error:
        'Error interno'

    })

  }

}