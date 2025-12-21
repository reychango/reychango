import { db } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  updateDoc,
  increment,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Colecciones
const POSTS_COLLECTION = 'posts';
const PHOTOS_COLLECTION = 'photos';
const ALBUMS_COLLECTION = 'albums';

// Función para formatear fechas
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
  } catch (error) {
    console.error('Error al formatear la fecha:', error);
    return dateString;
  }
}

// ===== FUNCIONES PARA POSTS =====

// Obtener todos los posts
export async function getPosts() {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    const posts = [];
    querySnapshot.forEach((doc) => {
      const postData = doc.data();

      // Convertir timestamps a strings para que sean serializables
      const serializedData = {};
      Object.keys(postData).forEach(key => {
        if (postData[key] && typeof postData[key].toDate === 'function') {
          // Es un timestamp de Firestore, convertirlo a string
          serializedData[key] = postData[key].toDate().toISOString();
        } else {
          serializedData[key] = postData[key];
        }
      });

      posts.push({
        ...serializedData,
        id: doc.id,
        formattedDate: formatDate(postData.date)
      });
    });

    return posts;
  } catch (error) {
    console.error('Error al obtener los posts:', error);
    return [];
  }
}

// Obtener un post por su slug
export async function getPostBySlug(slug) {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const q = query(postsRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const postData = doc.data();

    // Convertir timestamps a strings para que sean serializables
    const serializedData = {};
    Object.keys(postData).forEach(key => {
      if (postData[key] && typeof postData[key].toDate === 'function') {
        // Es un timestamp de Firestore, convertirlo a string
        serializedData[key] = postData[key].toDate().toISOString();
      } else {
        serializedData[key] = postData[key];
      }
    });

    return {
      ...serializedData,
      id: doc.id,
      formattedDate: formatDate(postData.date)
    };
  } catch (error) {
    console.error(`Error al obtener el post con slug ${slug}:`, error);
    return null;
  }
}

// Guardar un post (crear o actualizar)
export async function savePost(post) {
  try {
    // Si el post tiene un ID, actualizarlo
    if (post.id) {
      const postRef = doc(db, POSTS_COLLECTION, post.id);

      // Eliminar formattedDate si existe, ya que es un campo calculado
      const postToSave = { ...post };
      delete postToSave.formattedDate;

      await updateDoc(postRef, {
        ...postToSave,
        updatedAt: serverTimestamp()
      });
      return true;
    }
    // Si no tiene ID pero tiene slug, buscar si ya existe un post con ese slug
    else if (post.slug) {
      const postsRef = collection(db, POSTS_COLLECTION);
      const q = query(postsRef, where('slug', '==', post.slug));
      const querySnapshot = await getDocs(q);

      // Si existe un post con ese slug, actualizarlo
      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        const postRef = doc(db, POSTS_COLLECTION, existingDoc.id);

        // Eliminar formattedDate si existe
        const postToSave = { ...post };
        delete postToSave.formattedDate;

        await updateDoc(postRef, {
          ...postToSave,
          id: existingDoc.id, // Asegurar que el ID se mantiene
          updatedAt: serverTimestamp()
        });
        return true;
      }
      // Si no existe, crear uno nuevo
      else {
        // Eliminar formattedDate si existe
        const postToSave = { ...post };
        delete postToSave.formattedDate;

        await addDoc(collection(db, POSTS_COLLECTION), {
          ...postToSave,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return true;
      }
    }
    // Si no tiene ID ni slug, crear uno nuevo
    else {
      // Eliminar formattedDate si existe
      const postToSave = { ...post };
      delete postToSave.formattedDate;

      await addDoc(collection(db, POSTS_COLLECTION), {
        ...postToSave,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    }
  } catch (error) {
    console.error('Error al guardar el post:', error);
    throw error;
  }
}

// Eliminar un post
export async function deletePost(id) {
  try {
    await deleteDoc(doc(db, POSTS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error(`Error al eliminar el post ${id}:`, error);
    return false;
  }
}

// Obtener las etiquetas más populares
export async function getPopularTags(limit = 6) {
  try {
    const postsRef = collection(db, POSTS_COLLECTION);
    const querySnapshot = await getDocs(postsRef);

    // Objeto para contar la frecuencia de cada etiqueta
    const tagCounts = {};

    // Recorrer todos los posts y contar sus etiquetas
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      if (postData.tags && Array.isArray(postData.tags)) {
        postData.tags.forEach(tag => {
          if (tag) {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          }
        });
      }
    });

    // Convertir el objeto de conteo a un array
    const tagsArray = Object.keys(tagCounts).map(tag => ({
      name: tag,
      count: tagCounts[tag]
    }));

    // Ordenar por frecuencia (más populares primero) y limitar
    return tagsArray
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  } catch (error) {
    console.error('Error al obtener las etiquetas populares:', error);
    return [];
  }
}

// ===== FUNCIONES PARA FOTOS =====

// Función para dar like a un post
export async function likePost(slug) {
  try {
    const postRef = doc(db, POSTS_COLLECTION, slug);
    await updateDoc(postRef, {
      likes: increment(1)
    });
    return true;
  } catch (error) {
    console.error(`Error al dar like al post ${slug}:`, error);
    return false;
  }
}

// Obtener todas las fotos
export async function getPhotos() {
  try {
    const photosRef = collection(db, PHOTOS_COLLECTION);
    const q = query(photosRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    const photos = [];
    querySnapshot.forEach((doc) => {
      const photoData = doc.data();

      // Convertir timestamps a strings para que sean serializables
      const serializedData = {};
      Object.keys(photoData).forEach(key => {
        if (photoData[key] && typeof photoData[key].toDate === 'function') {
          // Es un timestamp de Firestore, convertirlo a string
          serializedData[key] = photoData[key].toDate().toISOString();
        } else {
          serializedData[key] = photoData[key];
        }
      });

      photos.push({
        ...serializedData,
        id: doc.id,
        formattedDate: formatDate(photoData.date)
      });
    });

    return photos;
  } catch (error) {
    console.error('Error al obtener las fotos:', error);
    return [];
  }
}

// Obtener una foto por su ID
export async function getPhotoById(id) {
  try {
    const photoRef = doc(db, PHOTOS_COLLECTION, id);
    const photoSnap = await getDoc(photoRef);

    if (!photoSnap.exists()) {
      return null;
    }

    const photoData = photoSnap.data();

    // Convertir timestamps a strings para que sean serializables
    const serializedData = {};
    Object.keys(photoData).forEach(key => {
      if (photoData[key] && typeof photoData[key].toDate === 'function') {
        // Es un timestamp de Firestore, convertirlo a string
        serializedData[key] = photoData[key].toDate().toISOString();
      } else {
        serializedData[key] = photoData[key];
      }
    });

    return {
      ...serializedData,
      id: photoSnap.id,
      formattedDate: formatDate(photoData.date)
    };
  } catch (error) {
    console.error(`Error al obtener la foto con ID ${id}:`, error);
    return null;
  }
}

// Obtener fotos por álbum
export async function getPhotosByAlbum(album) {
  try {
    const photosRef = collection(db, PHOTOS_COLLECTION);
    const q = query(
      photosRef,
      where('album', '==', album),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const photos = [];
    querySnapshot.forEach((doc) => {
      const photoData = doc.data();

      // Convertir timestamps a strings para que sean serializables
      const serializedData = {};
      Object.keys(photoData).forEach(key => {
        if (photoData[key] && typeof photoData[key].toDate === 'function') {
          // Es un timestamp de Firestore, convertirlo a string
          serializedData[key] = photoData[key].toDate().toISOString();
        } else {
          serializedData[key] = photoData[key];
        }
      });

      photos.push({
        ...serializedData,
        id: doc.id,
        formattedDate: formatDate(photoData.date)
      });
    });

    return photos;
  } catch (error) {
    console.error(`Error al obtener fotos del álbum ${album}:`, error);
    return [];
  }
}

// Guardar una foto (crear o actualizar)
export async function savePhoto(photo) {
  try {
    // Si la foto tiene un ID, actualizarla
    if (photo.id) {
      const photoRef = doc(db, PHOTOS_COLLECTION, photo.id);
      await setDoc(photoRef, {
        ...photo,
        updatedAt: serverTimestamp()
      }, { merge: true });
      return true;
    }
    // Si no tiene ID, crear una nueva
    else {
      await addDoc(collection(db, PHOTOS_COLLECTION), {
        ...photo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return true;
    }
  } catch (error) {
    console.error('Error al guardar la foto:', error);
    return false;
  }
}

// Eliminar una foto
export async function deletePhoto(id) {
  try {
    await deleteDoc(doc(db, PHOTOS_COLLECTION, id));
    return true;
  } catch (error) {
    console.error(`Error al eliminar la foto ${id}:`, error);
    return false;
  }
}

// ===== FUNCIONES PARA ÁLBUMES =====

// Obtener todos los álbumes
export async function getAlbums() {
  try {
    const albumsRef = collection(db, ALBUMS_COLLECTION);
    const querySnapshot = await getDocs(albumsRef);

    const albums = [];
    querySnapshot.forEach((doc) => {
      const albumData = doc.data();

      // Convertir timestamps a strings para que sean serializables
      const serializedData = {};
      Object.keys(albumData).forEach(key => {
        if (albumData[key] && typeof albumData[key].toDate === 'function') {
          // Es un timestamp de Firestore, convertirlo a string
          serializedData[key] = albumData[key].toDate().toISOString();
        } else {
          serializedData[key] = albumData[key];
        }
      });

      albums.push({
        ...serializedData,
        id: doc.id
      });
    });

    return albums;
  } catch (error) {
    console.error('Error al obtener los álbumes:', error);
    return [];
  }
}

// Guardar un álbum (crear o actualizar)
export async function saveAlbum(album) {
  try {
    // Si se cambió el nombre del álbum, actualizar todas las fotos
    if (album.oldName && album.oldName !== album.name) {
      const photosRef = collection(db, PHOTOS_COLLECTION);
      const q = query(photosRef, where('album', '==', album.oldName));
      const querySnapshot = await getDocs(q);

      // Actualizar el álbum en todas las fotos
      const batch = [];
      querySnapshot.forEach((photoDoc) => {
        const photoRef = doc(db, PHOTOS_COLLECTION, photoDoc.id);
        batch.push(updateDoc(photoRef, { album: album.name }));
      });

      // Ejecutar todas las actualizaciones
      await Promise.all(batch);
    }

    return true;
  } catch (error) {
    console.error('Error al guardar el álbum:', error);
    return false;
  }
}

// Eliminar un álbum
export async function deleteAlbum(albumName) {
  try {
    // Actualizar todas las fotos que pertenecen al álbum eliminado
    const photosRef = collection(db, PHOTOS_COLLECTION);
    const q = query(photosRef, where('album', '==', albumName));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return false; // No hay fotos con este álbum
    }

    // Actualizar el álbum en todas las fotos a "Sin álbum"
    const batch = [];
    querySnapshot.forEach((photoDoc) => {
      const photoRef = doc(db, PHOTOS_COLLECTION, photoDoc.id);
      batch.push(updateDoc(photoRef, { album: 'Sin álbum' }));
    });

    // Ejecutar todas las actualizaciones
    await Promise.all(batch);

    return true;
  } catch (error) {
    console.error(`Error al eliminar el álbum ${albumName}:`, error);
    return false;
  }
}
