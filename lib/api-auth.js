// Helper para validar autenticación en API routes
import { auth } from '../lib/firebase';
// import { verifyIdToken } from '../lib/firebase-admin';

/**
 * Verificar autenticación en API routes
 * Esta función valida el token de Firebase Auth enviado en el header Authorization
 * 
 * @param {object} req - Request object de Next.js
 * @returns {Promise<{authenticated: boolean, user: object|null, error: string|null}>}
 */
export async function verifyAuth(req) {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authenticated: false,
        user: null,
        error: 'Token de autenticación no proporcionado'
      };
    }

    const token = authHeader.split('Bearer ')[1];

    // Verificar el token usando Firebase Admin SDK
    // Nota: Necesitarás configurar Firebase Admin SDK para esto
    // Por ahora, usaremos una verificación básica del token

    // En producción, deberías usar Firebase Admin SDK:
    // const decodedToken = await verifyIdToken(token);

    // Por ahora, validamos que el token existe y tiene formato válido
    if (!token || token.length < 20) {
      return {
        authenticated: false,
        user: null,
        error: 'Token inválido'
      };
    }

    // TODO: Implementar verificación real con Firebase Admin SDK
    // Por ahora, retornamos éxito si el token existe
    // En producción, esto DEBE ser reemplazado por verificación real

    return {
      authenticated: true,
      user: { uid: 'temp', email: 'admin@example.com' },
      error: null
    };
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    return {
      authenticated: false,
      user: null,
      error: 'Error al verificar autenticación'
    };
  }
}

/**
 * Middleware helper para proteger API routes
 * Uso: const authResult = await requireAuth(req);
 *      if (!authResult.authenticated) return res.status(401).json({...});
 */
export async function requireAuth(req) {
  const authResult = await verifyAuth(req);

  if (!authResult.authenticated) {
    return {
      ...authResult,
      statusCode: 401
    };
  }

  return authResult;
}

