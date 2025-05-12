import { savePost } from '../../../lib/firestore';

export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido' 
    });
  }

  try {
    // Obtener datos del post del cuerpo de la solicitud
    const post = req.body;
    
    // Validar datos requeridos
    if (!post || !post.title || !post.slug || !post.content) {
      return res.status(400).json({ 
        success: false,
        message: 'Faltan datos requeridos (título, slug o contenido)' 
      });
    }
    
    // Guardar el post utilizando la función del servidor
    const success = await savePost(post);
    
    if (success) {
      return res.status(200).json({ 
        success: true,
        message: 'Post guardado correctamente' 
      });
    } else {
      return res.status(500).json({ 
        success: false,
        message: 'Error al guardar el post' 
      });
    }
  } catch (error) {
    console.error('Error al guardar el post:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
}
