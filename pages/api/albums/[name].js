import { deleteAlbum } from '../../../lib/firestore';

export default async function handler(req, res) {
  const { name } = req.query;
  
  if (req.method === 'GET') {
    // En el futuro podríamos implementar obtener un álbum específico
    return res.status(501).json({ message: 'No implementado' });
  }
  
  if (req.method === 'DELETE') {
    try {
      if (!name) {
        return res.status(400).json({ 
          success: false,
          message: 'El nombre del álbum es obligatorio' 
        });
      }
      
      const success = await deleteAlbum(name);
      
      if (success) {
        return res.status(200).json({ 
          success: true,
          message: 'Álbum eliminado correctamente' 
        });
      } else {
        return res.status(404).json({ 
          success: false,
          message: 'Álbum no encontrado' 
        });
      }
    } catch (error) {
      console.error(`Error al eliminar el álbum ${name}:`, error);
      return res.status(500).json({ 
        success: false,
        message: 'Error al eliminar el álbum' 
      });
    }
  }
  
  return res.status(405).json({ message: 'Método no permitido' });
}
