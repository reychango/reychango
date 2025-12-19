import { savePhoto } from '../../../lib/firestore';
import { requireAuth } from '../../../lib/api-auth';

/**
 * API Route para guardar/actualizar una foto
 * Requiere autenticación mediante token de Firebase Auth
 */
export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido',
      error: 'METHOD_NOT_ALLOWED'
    });
  }

  try {
    // Verificar autenticación
    const authResult = await requireAuth(req);
    
    if (!authResult.authenticated) {
      return res.status(authResult.statusCode || 401).json({ 
        success: false,
        message: authResult.error || 'No autorizado',
        error: 'UNAUTHORIZED'
      });
    }

    // Obtener datos de la foto del cuerpo de la solicitud
    const photo = req.body;
    
    // Validar datos requeridos
    if (!photo || !photo.title || !photo.url) {
      return res.status(400).json({ 
        success: false,
        message: 'Faltan datos requeridos (título o URL)',
        error: 'MISSING_REQUIRED_FIELDS',
        required: ['title', 'url']
      });
    }

    // Validar que la URL sea válida
    try {
      new URL(photo.url);
    } catch (urlError) {
      return res.status(400).json({ 
        success: false,
        message: 'La URL proporcionada no es válida',
        error: 'INVALID_URL_FORMAT'
      });
    }
    
    // Guardar la foto utilizando la función del servidor
    const success = await savePhoto(photo);
    
    if (success) {
      return res.status(200).json({ 
        success: true,
        message: 'Foto guardada correctamente',
        data: { id: photo.id || 'new' }
      });
    } else {
      return res.status(500).json({ 
        success: false,
        message: 'Error al guardar la foto en la base de datos',
        error: 'DATABASE_ERROR'
      });
    }
  } catch (error) {
    console.error('Error al guardar la foto:', error);
    
    // Mensajes de error más específicos
    let errorMessage = 'Error interno del servidor';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    
    if (error.message && error.message.includes('permission')) {
      errorMessage = 'No tienes permisos para realizar esta acción';
      errorCode = 'PERMISSION_DENIED';
    } else if (error.message && error.message.includes('network')) {
      errorMessage = 'Error de conexión con la base de datos';
      errorCode = 'NETWORK_ERROR';
    }
    
    return res.status(500).json({ 
      success: false,
      message: errorMessage,
      error: errorCode
    });
  }
}
