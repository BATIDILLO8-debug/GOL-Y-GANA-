import { getToken } from 'firebase/messaging'
import { messaging } from './firebase'
import { supabase } from './supabase'

export const registrarPush = async () => {

  try {

    console.log(
      'Iniciando registro push'
    )

    const permiso =
      await Notification.requestPermission()

    console.log(
      'Permiso:',
      permiso
    )

    if (
      permiso !== 'granted'
    ) {

      console.log(
        'Permiso rechazado'
      )

      return

    }

    if (!messaging) {

      console.log(
        'Messaging no disponible'
      )

      return

    }

    const token =
      await getToken(
        messaging,
        {
          vapidKey:
            'BADFaW3VnnDyJo2GMeYxeA3Q8m6M7cveJea64KBoLkQz4tNW3t4GhVSkQY7CarQefoPpdzbg9qyTbRWKeWayva4'
        }
      )

    console.log(
      'TOKEN FCM:',
      token
    )

    if (!token) {

      console.log(
        'No se obtuvo token'
      )

      return

    }

    const { data: existe } =
      await supabase
        .from(
          'push_subscriptions'
        )
        .select('id')
        .eq(
          'token',
          token
        )
        .maybeSingle()

    if (!existe) {

      const { error } =
        await supabase
          .from(
            'push_subscriptions'
          )
          .insert([
            {
              token
            }
          ])

      if (error) {

        console.log(
          'Error Supabase:',
          error
        )

      } else {

        console.log(
          'Token guardado'
        )

      }

    } else {

      console.log(
        'Token ya existe'
      )

    }

  } catch (error) {

    console.log(
      'ERROR PUSH:',
      error
    )

  }

}