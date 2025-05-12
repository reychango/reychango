import { savePhoto } from '../../../lib/firestore';

export default async function handler(req, res) {
  // Solo permitir método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido' 
    });
  }

  try {
    // Obtener datos de la foto del cuerpo de la solicitud
    const photo = req.body;
    
    // Validar datos requeridos
    if (!photo || !photo.title || !photo.url) {
      return res.status(400).json({ 
        success: false,
        message: 'Faltan datos requeridos (título o URL)' 
      });
    }
    
    // Guardar la foto utilizando la función del servidor
    const success = await savePhoto(photo);
    
    if (success) {
      return res.status(200).json({ 
        success: true,
        message: 'Foto guardada correctamente' 
      });
    } else {
      return res.status(500).json({ 
        success: false,
        message: 'Error al guardar la foto' 
      });
    }
  } catch (error) {
    console.error('Error al guardar la foto:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
}
