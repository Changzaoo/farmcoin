import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBsI7jnvtGchUGXk0kHaxQc92O2B9nzRbo",
  authDomain: "farmcoin-5b248.firebaseapp.com",
  projectId: "farmcoin-5b248",
  storageBucket: "farmcoin-5b248.firebasestorage.app",
  messagingSenderId: "227097466201",
  appId: "1:227097466201:web:9d5b16af60d1f17e056848",
  measurementId: "G-2T8H941XDQ"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços (apenas Firestore e Analytics)
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
