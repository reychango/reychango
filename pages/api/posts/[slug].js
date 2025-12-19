import { getPostBySlug, deletePost } from '../../../lib/firestore';
import { requireAuth } from '../../../lib/api-auth';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ success: false, message: 'Slug de post no proporcionado' });
  }

  // Manejar eliminación
  if (req.method === 'DELETE') {
    try {
      const authResult = await requireAuth(req);
      if (!authResult.authenticated) {
        return res.status(401).json({ success: false, message: 'No autorizado' });
      }

      const success = await deletePost(slug);
      if (success) {
        return res.status(200).json({ success: true, message: 'Post eliminado' });
      } else {
        return res.status(500).json({ success: false, message: 'Error al eliminar el post' });
      }
    } catch (error) {
      console.error('Error al eliminar post:', error);
      return res.status(500).json({ success: false, message: 'Error interno' });
    }
  }

  // Solo permitir método GET (y DELETE ahora)
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    // Obtener el post por slug
    const post = await getPostBySlug(slug);

    if (post) {
      return res.status(200).json(post);
    } else {
      return res.status(404).json({ success: false, message: 'Post no encontrado' });
    }
  } catch (error) {
    console.error('Error al obtener el post:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
}
