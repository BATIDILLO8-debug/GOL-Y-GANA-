import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyAJr_pmM4SmFiZyXU0-19dJeS0V-NwyNoM",
  authDomain: "gol-y-gana.firebaseapp.com",
  projectId: "gol-y-gana",
  storageBucket: "gol-y-gana.firebasestorage.app",
  messagingSenderId: "949108757133",
  appId: "1:949108757133:web:60ec28ab0ff70d290008c4",
}

const app = initializeApp(firebaseConfig)

export const messaging =
  typeof window !== 'undefined'
    ? getMessaging(app)
    : null