import { getToken } from 'firebase/messaging'
import { messaging } from './firebase'
import { supabase } from './supabase'

export const registrarPush = async () => {

  try {

    const permiso =
      await Notification.requestPermission()

    if (permiso !== 'granted') {

      return

    }

    if (!messaging) return

    const token = await getToken(
      messaging,
      {
        vapidKey:
          'BADFaW3VnnDyJo2GMeYxeA3Q8m6M7cveJea64KBoLkQz4tNW3t4GhVSkQY7CarQefoPpdzbg9qyTbRWKeWayva4'
      }
    )

    if (!token) return

    const { data: existe } =
      await supabase
        .from('push_subscriptions')
        .select('id')
        .eq('token', token)
        .maybeSingle()

    if (!existe) {

      await supabase
        .from('push_subscriptions')
        .insert([
          {
            token
          }
        ])

    }

  } catch (error) {

    console.log(error)

  }

}