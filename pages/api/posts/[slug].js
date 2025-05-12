import { getPostBySlug } from '../../../lib/firestore';

export default async function handler(req, res) {
  // Solo permitir método GET
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    const { slug } = req.query;
    
    if (!slug) {
      return res.status(400).json({ success: false, message: 'Slug de post no proporcionado' });
    }
    
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
