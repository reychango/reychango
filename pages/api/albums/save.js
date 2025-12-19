import { saveAlbum } from '../../../lib/firestore';
import { requireAuth } from '../../../lib/api-auth';

/**
 * API Route para guardar/actualizar un álbum
 * Requiere autenticación mediante token de Firebase Auth
 */
export default async function handler(req, res) {
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

    const album = req.body;
    
    // Validar datos requeridos
    if (!album || !album.name) {
      return res.status(400).json({ 
        success: false,
        message: 'El nombre del álbum es obligatorio',
        error: 'MISSING_REQUIRED_FIELDS',
        required: ['name']
      });
    }

    // Validar que el nombre del álbum no esté vacío
    if (album.name.trim().length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'El nombre del álbum no puede estar vacío',
        error: 'INVALID_ALBUM_NAME'
      });
    }
    
    // Guardar el álbum
    const success = await saveAlbum(album);
    
    if (success) {
      return res.status(200).json({ 
        success: true,
        message: 'Álbum guardado correctamente',
        data: { name: album.name }
      });
    } else {
      return res.status(500).json({ 
        success: false,
        message: 'Error al guardar el álbum en la base de datos',
        error: 'DATABASE_ERROR'
      });
    }
  } catch (error) {
    console.error('Error al guardar el álbum:', error);
    
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
