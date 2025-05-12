import { saveAlbum } from '../../../lib/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const album = req.body;
    
    // Validar datos requeridos
    if (!album || !album.name) {
      return res.status(400).json({ 
        success: false,
        message: 'El nombre del álbum es obligatorio' 
      });
    }
    
    // Guardar el álbum
    const success = await saveAlbum(album);
    
    if (success) {
      res.status(200).json({ 
        success: true,
        message: 'Álbum guardado correctamente' 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: 'Error al guardar el álbum' 
      });
    }
  } catch (error) {
    console.error('Error al guardar el álbum:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al guardar el álbum' 
    });
  }
}
