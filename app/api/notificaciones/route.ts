import { NextResponse } from 'next/server'

import { messaging } from '@/lib/firebase-admin'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: Request
) {

  try {

    const {
      titulo,
      mensaje
    } = await request.json()

    const { data: tokens } =
      await supabase
        .from('push_subscriptions')
        .select('token')

    if (!tokens?.length) {

      return NextResponse.json({
        success: false,
        message: 'No hay dispositivos'
      })

    }

    let enviados = 0

    for (const item of tokens) {

      try {

        await messaging.send({

          token: item.token,

          notification: {
            title: titulo,
            body: mensaje
          }

        })

        enviados++

      } catch (error) {

        console.log(
          'Token inválido:',
          item.token
        )

      }

    }

    return NextResponse.json({

      success: true,

      enviados

    })

  } catch (error) {

    console.log(error)

    return NextResponse.json({

      success: false

    })

  }

}