importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js'
)

importScripts(
  'https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js'
)

firebase.initializeApp({

  apiKey: "AIzaSyAJr_pmM4SmFiZyXU0-19dJeS0V-NwyNoM",

  authDomain: "gol-y-gana.firebaseapp.com",

  projectId: "gol-y-gana",

  storageBucket: "gol-y-gana.firebasestorage.app",

  messagingSenderId: "949108757133",

  appId: "1:949108757133:web:60ec28ab0ff70d290008c4"

})

const messaging =
  firebase.messaging()

messaging.onBackgroundMessage(
  (payload) => {

    self.registration.showNotification(

      payload.notification.title,

      {
        body:
          payload.notification.body,

        icon:
          '/icon-192.png'
      }

    )

  }
)