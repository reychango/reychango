import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuración de Firebase usando variables de entorno
// IMPORTANTE: Todas las variables deben estar definidas en .env.local
// Configuración de Firebase - Valores directos para evitar errores de entorno
const firebaseConfig = {
  apiKey: "AIzaSyDgycSrAY1tV0LRQQI8HNfBP19SIgRDm9U",
  authDomain: "reychangoblog.firebaseapp.com",
  projectId: "reychangoblog",
  storageBucket: "reychangoblog.firebasestorage.app",
  messagingSenderId: "300069716396",
  appId: "1:300069716396:web:b1ebf69102e3bae85c3a09"
};

// Validar que todas las variables de entorno estén definidas
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  console.error('❌ Error: Faltan variables de entorno de Firebase. Por favor, crea un archivo .env.local con las credenciales necesarias.');
  console.error('📝 Consulta el archivo .env.example para ver qué variables necesitas.');
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Inicializar Firebase Authentication
const auth = getAuth(app);

export { app, db, auth };
