import { getPhotoById } from '../../../lib/firestore';

export default async function handler(req, res) {
  // Solo permitir método GET
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ success: false, message: 'Se requiere un ID' });
    }
    
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
