import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  getPosts as getFirestorePosts,
  getPostBySlug as getFirestorePostBySlug,
  getPhotos as getFirestorePhotos,
  getPhotoById as getFirestorePhotoById,
  getAlbums as getFirestoreAlbums,
  getPopularTags as getFirestorePopularTags,
  savePost as saveFirestorePost,
  savePhoto as saveFirestorePhoto,
  deletePost as deleteFirestorePost,
  deletePhoto as deleteFirestorePhoto,
  saveAlbum as saveFirestoreAlbum,
  deleteAlbum as deleteFirestoreAlbum
} from './firestore';

// Función para obtener todos los posts
export async function getPosts() {
  try {
    // Usar Firestore en lugar de datos estáticos
    const posts = await getFirestorePosts();
    
    // Ordenar por fecha (más reciente primero)
    return posts.sort((post1, post2) => {
      return new Date(post2.date) - new Date(post1.date);
    }).map(post => ({
      ...post,
      formattedDate: formatDate(post.date)
    }));
  } catch (error) {
    console.error('Error al cargar los posts:', error);
    return [];
  }
}

// Función para obtener un post por su slug
export async function getPostBySlug(slug) {
  try {
    // Usar Firestore en lugar de datos estáticos
    const post = await getFirestorePostBySlug(slug);
    
    if (!post) {
      return null;
    }
    
    return {
      ...post,
      formattedDate: formatDate(post.date)
    };
  } catch (error) {
    console.error(`Error al obtener el post con slug ${slug}:`, error);
    return null;
  }
}

// Función para obtener todas las fotos
export async function getPhotos() {
  try {
    // Usar Firestore en lugar de datos estáticos
    const photos = await getFirestorePhotos();
    
    // Ordenar por fecha (más reciente primero)
    return photos.sort((photo1, photo2) => {
      return new Date(photo2.date) - new Date(photo1.date);
    }).map(photo => ({
      ...photo,
      formattedDate: formatDate(photo.date)
    }));
  } catch (error) {
    console.error('Error al cargar las fotos:', error);
    return [];
  }
}

// Función para obtener una foto por su ID
export async function getPhotoById(id) {
  try {
    const photos = await getPhotos();
    const photo = photos.find(p => p.id === id);
    
    if (!photo) {
      return null;
    }
    
    return {
      ...photo,
      formattedDate: formatDate(photo.date)
    };
  } catch (error) {
    console.error(`Error al obtener la foto con ID ${id}:`, error);
    return null;
  }
}

// Función para obtener fotos por álbum
export async function getPhotosByAlbum(album) {
  try {
    const photos = await getPhotos();
    return photos.filter(photo => photo.album === album);
  } catch (error) {
    console.error(`Error al obtener fotos del álbum ${album}:`, error);
    return [];
  }
}

// Función para obtener todos los álbumes
export async function getAlbums() {
  try {
    const albums = await getFirestoreAlbums();
    return albums;
  } catch (error) {
    console.error('Error al obtener los álbumes:', error);
    return [];
  }
}

// Función para obtener las etiquetas más populares
export async function getPopularTags(limit = 6) {
  try {
    // Usar Firestore para obtener las etiquetas populares
    const tags = await getFirestorePopularTags(limit);
    return tags;
  } catch (error) {
    console.error('Error al obtener las etiquetas populares:', error);
    return [];
  }
}

// Las funciones de escritura solo funcionarán en el servidor
// Estas funciones no se deben llamar desde el cliente
export async function savePost(post) {
  if (typeof window !== 'undefined') {
    console.error('Esta función solo puede ejecutarse en el servidor');
    return false;
  }
  
  try {
    // Usar Firestore en lugar de archivos JSON locales
    return await saveFirestorePost(post);
  } catch (error) {
    console.error('Error al guardar el post:', error);
    return false;
  }
}

// Función para guardar una nueva foto
export async function savePhoto(photo) {
  if (typeof window !== 'undefined') {
    console.error('Esta función solo puede ejecutarse en el servidor');
    return false;
  }
  
  try {
    // Usar Firestore en lugar de archivos JSON locales
    return await saveFirestorePhoto(photo);
  } catch (error) {
    console.error('Error al guardar la foto:', error);
    return false;
  }
}

// Función para eliminar un post
export async function deletePost(slug) {
  if (typeof window !== 'undefined') {
    console.error('Esta función solo puede ejecutarse en el servidor');
    return false;
  }
  
  try {
    // Usar Firestore en lugar de archivos JSON locales
    return await deleteFirestorePost(slug);
  } catch (error) {
    console.error(`Error al eliminar el post con slug ${slug}:`, error);
    return false;
  }
}

// Función para eliminar una foto
export async function deletePhoto(id) {
  if (typeof window !== 'undefined') {
    console.error('Esta función solo puede ejecutarse en el servidor');
    return false;
  }
  
  try {
    // Usar Firestore en lugar de archivos JSON locales
    return await deleteFirestorePhoto(id);
  } catch (error) {
    console.error(`Error al eliminar la foto con ID ${id}:`, error);
    return false;
  }
}

// Función para guardar un álbum (crear o actualizar)
export async function saveAlbum(album) {
  if (typeof window !== 'undefined') {
    console.error('Esta función solo debe ejecutarse en el servidor');
    return false;
  }

  try {
    // Usar Firestore en lugar de archivos JSON locales
    return await saveFirestoreAlbum(album);
  } catch (error) {
    console.error('Error al guardar el álbum:', error);
    return false;
  }
}

// Función para eliminar un álbum
export async function deleteAlbum(albumName) {
  if (typeof window !== 'undefined') {
    console.error('Esta función solo debe ejecutarse en el servidor');
    return false;
  }

  try {
    // Usar Firestore en lugar de archivos JSON locales
    return await deleteFirestoreAlbum(albumName);
  } catch (error) {
    console.error(`Error al eliminar el álbum ${albumName}:`, error);
    return false;
  }
}

// Función auxiliar para formatear fechas
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch (error) {
    console.error(`Error al formatear la fecha ${dateString}:`, error);
    return dateString;
  }
}
