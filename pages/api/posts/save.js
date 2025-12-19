import { savePost } from '../../../lib/firestore';
import { requireAuth } from '../../../lib/api-auth';

/**
 * API Route para guardar/actualizar un post
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

    // Obtener datos del post del cuerpo de la solicitud
    const post = req.body;

    // Validar datos requeridos
    if (!post || !post.title || !post.slug || !post.content) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos (título, slug o contenido)',
        error: 'MISSING_REQUIRED_FIELDS',
        required: ['title', 'slug', 'content']
      });
    }

    // Validar formato del slug (solo letras, números, guiones y guiones bajos)
    const slugRegex = /^[a-z0-9-_]+$/;
    if (!slugRegex.test(post.slug)) {
      return res.status(400).json({
        success: false,
        message: 'El slug solo puede contener letras minúsculas, números, guiones y guiones bajos',
        error: 'INVALID_SLUG_FORMAT'
      });
    }

    // Guardar el post utilizando la función del servidor
    await savePost(post);

    return res.status(200).json({
      success: true,
      message: 'Post guardado correctamente',
      data: { slug: post.slug }
    });

  } catch (error) {
    console.error('Error al guardar el post:', error);

    return res.status(500).json({
      success: false,
      message: `Error al guardar: ${error.message || 'Error desconocido'}`,
      error: error.code || 'INTERNAL_SERVER_ERROR'
    });
  }
}
