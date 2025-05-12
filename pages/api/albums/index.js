import { getAlbums } from '../../../lib/firestore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    const albums = await getAlbums();
    res.status(200).json(albums);
  } catch (error) {
    console.error('Error al obtener los álbumes:', error);
    res.status(500).json({ message: 'Error al obtener los álbumes' });
  }
}
