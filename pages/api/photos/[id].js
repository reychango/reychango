import { getPhotoById, deletePhoto } from '../../../lib/firestore';
import { requireAuth } from '../../../lib/api-auth';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Se requiere un ID' });
  }

  // Manejar eliminación
  if (req.method === 'DELETE') {
    try {
      const authResult = await requireAuth(req);
      if (!authResult.authenticated) {
        return res.status(401).json({ success: false, message: 'No autorizado' });
      }

      const success = await deletePhoto(id);
      if (success) {
        return res.status(200).json({ success: true, message: 'Foto eliminada' });
      } else {
        return res.status(500).json({ success: false, message: 'Error al eliminar la foto' });
      }
    } catch (error) {
      console.error('Error al eliminar foto:', error);
      return res.status(500).json({ success: false, message: 'Error interno' });
    }
  }

  // Solo permitir método GET
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    // Obtener la foto por ID
    const photo = await getPhotoById(id);

    if (!photo) {
      return res.status(404).json({ success: false, message: 'Foto no encontrada' });
    }

    return res.status(200).json(photo);
  } catch (error) {
    console.error(`Error al obtener la foto ${id}:`, error);
    return res.status(500).json({ success: false, message: 'Error al obtener la foto' });
  }
}
