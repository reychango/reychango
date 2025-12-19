import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import OptimizedImage from '../../components/OptimizedImage';
import { getPhotos, getAlbums } from '../../lib/api';

export default function Photos({ photos, albums }) {
  const router = useRouter();
  const [selectedAlbum, setSelectedAlbum] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  
  // Filtrar fotos por álbum seleccionado
  const filteredPhotos = selectedAlbum === 'all' 
    ? photos 
    : photos.filter(photo => photo.album === selectedAlbum);
  
  // Abrir lightbox con la foto seleccionada
  const openLightbox = (photo) => {
    setCurrentPhoto(photo);
    setLightboxOpen(true);
    // Prevenir scroll cuando el lightbox está abierto
    document.body.style.overflow = 'hidden';
  };
  
  // Cerrar lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentPhoto(null);
    // Restaurar scroll
    document.body.style.overflow = 'auto';
  };
  
  // Navegar a la foto anterior
  const prevPhoto = () => {
    const currentIndex = filteredPhotos.findIndex(photo => photo.id === currentPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setCurrentPhoto(filteredPhotos[prevIndex]);
  };
  
  // Navegar a la foto siguiente
  const nextPhoto = () => {
    const currentIndex = filteredPhotos.findIndex(photo => photo.id === currentPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setCurrentPhoto(filteredPhotos[nextIndex]);
  };
  
  // Función para ir al editor con la foto seleccionada
  const handleEdit = (photo, e) => {
    e.stopPropagation(); // Evitar que se abra el lightbox
    router.push({
      pathname: '/admin/editor',
      query: { 
        type: 'photo',
        id: photo.id
      }
    });
  };
  
  return (
    <>
      <Head>
        <title>Fotos - Los desvaríos de Reychango</title>
        <meta name="description" content="Galería de fotos de Los desvaríos de Reychango" />
      </Head>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Galería de Fotos</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Una colección de momentos capturados a través de mi lente. Explora las diferentes categorías y disfruta de las imágenes.
          </p>
          
          {/* Filtro de álbumes */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedAlbum('all')}
              className={`px-4 py-2 rounded-full ${
                selectedAlbum === 'all'
                  ? 'bg-primary-500 text-white dark:bg-primary-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Todos
            </button>
            {albums.map(album => (
              <button
                key={album.name}
                onClick={() => setSelectedAlbum(album.name)}
                className={`px-4 py-2 rounded-full ${
                  selectedAlbum === album.name
                    ? 'bg-primary-500 text-white dark:bg-primary-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {album.name} ({album.count})
              </button>
            ))}
          </div>
        </div>
        
        {/* Galería de fotos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 bg-gray-200 dark:bg-gray-700"
              onClick={() => openLightbox(photo)}
            >
              <OptimizedImage
                src={photo.thumbnailUrl || photo.url || '/img/placeholder-1.jpg'}
                alt={photo.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
                <h3 className="text-white font-semibold mb-2 text-center text-sm">{photo.title}</h3>
                {photo.album && (
                  <span className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full text-white mb-2">
                    {photo.album}
                  </span>
                )}
                <button 
                  onClick={(e) => handleEdit(photo, e)}
                  className="bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors transform hover:scale-110"
                  aria-label="Editar foto"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Lightbox */}
        {lightboxOpen && currentPhoto && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
              onClick={closeLightbox}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <button 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
              onClick={prevPhoto}
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="relative w-full h-full max-w-4xl max-h-[80vh] mx-auto">
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.title}
                fill
                className="object-contain"
              />
            </div>
            
            <button 
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
              onClick={nextPhoto}
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <h3 className="text-xl font-bold">{currentPhoto.title}</h3>
              <p className="text-sm mt-1">{currentPhoto.description}</p>
              <p className="text-xs mt-2">{currentPhoto.formattedDate} • {currentPhoto.album}</p>
            </div>
          </div>
        )}
        
        {/* Mensaje si no hay fotos */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-400">No hay fotos en esta categoría.</p>
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  try {
    const photos = await getPhotos();
    const albums = await getAlbums();
    
    // Asegurarnos de que todos los datos sean serializables
    const serializablePhotos = photos.map(photo => {
      const serializedPhoto = { ...photo };
      
      // Convertir timestamps a strings
      if (serializedPhoto.createdAt && typeof serializedPhoto.createdAt === 'object') {
        serializedPhoto.createdAt = serializedPhoto.createdAt.toString();
      }
      if (serializedPhoto.updatedAt && typeof serializedPhoto.updatedAt === 'object') {
        serializedPhoto.updatedAt = serializedPhoto.updatedAt.toString();
      }
      
      return serializedPhoto;
    });
    
    // Hacer lo mismo con los álbumes
    const serializableAlbums = albums.map(album => {
      const serializedAlbum = { ...album };
      
      // Convertir timestamps a strings
      if (serializedAlbum.createdAt && typeof serializedAlbum.createdAt === 'object') {
        serializedAlbum.createdAt = serializedAlbum.createdAt.toString();
      }
      if (serializedAlbum.updatedAt && typeof serializedAlbum.updatedAt === 'object') {
        serializedAlbum.updatedAt = serializedAlbum.updatedAt.toString();
      }
      
      return serializedAlbum;
    });
    
    return {
      props: {
        photos: serializablePhotos,
        albums: serializableAlbums,
      },
      // Revalidar la página cada 10 segundos para reflejar cambios en Firestore
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error al obtener datos para la página de fotos:', error);
    // En caso de error, devolver arrays vacíos
    return {
      props: {
        photos: [],
        albums: [],
      },
      revalidate: 10,
    };
  }
}
