// Helper functions para autenticación con Firebase Auth
import { auth } from './firebase';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';

/**
 * Iniciar sesión con email y contraseña
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<{success: boolean, user: object|null, error: string|null}>}
 */
export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified
      },
      error: null
    };
  } catch (error) {
    let errorMessage = 'Error al iniciar sesión';

    // Mensajes de error más amigables en español
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        errorMessage = 'Credenciales incorrectas (Usuario no encontrado o contraseña incorrecta)';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Usuario deshabilitado';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de conexión. Verifica tu internet';
        break;
      default:
        errorMessage = error.message || 'Error desconocido';
    }

    return {
      success: false,
      user: null,
      error: errorMessage
    };
  }
}

/**
 * Cerrar sesión
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return {
      success: true,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Error al cerrar sesión'
    };
  }
}

/**
 * Obtener el usuario actual
 * @returns {Promise<object|null>}
 */
export function getCurrentUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified
        });
      } else {
        resolve(null);
      }
    });
  });
}

/**
 * Verificar si el usuario está autenticado
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Obtener el token de autenticación del usuario actual
 * @returns {Promise<string|null>}
 */
export async function getIdToken() {
  try {
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  } catch (error) {
    console.error('Error al obtener el token:', error);
    return null;
  }
}
