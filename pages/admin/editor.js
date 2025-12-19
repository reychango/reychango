import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import apiClient from '../../lib/api-client';
import { getCurrentUser } from '../../lib/auth';
import { savePost, savePhoto } from '../../lib/firestore';
import { SaveIcon, UploadIcon } from '../../components/Icons';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';

// Importar el editor de Markdown dinámicamente (sin SSR)
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });
import 'easymde/dist/easymde.min.css';

// Componente para subir imágenes a imgBB
function ImageUploader({ onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Clave API de imgBB - obtener desde variables de entorno
  // Clave API de imgBB - obtener desde variables de entorno o usar fallback
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || process.env.IMGBB_API_KEY || '96c8ea0e1e8b9c022b4dcbf65d002d15';

  // Cargar álbumes desde localStorage o inicializar
  useEffect(() => {
    const savedAlbums = localStorage.getItem('imgbb_albums');
    if (savedAlbums) {
      setAlbums(JSON.parse(savedAlbums));
      if (JSON.parse(savedAlbums).length > 0) {
        setSelectedAlbum(JSON.parse(savedAlbums)[0]);
      }
    } else {
      // Álbumes por defecto
      const defaultAlbums = ['Blog', 'Paisajes', 'Eventos', 'Personal'];
      localStorage.setItem('imgbb_albums', JSON.stringify(defaultAlbums));
      setAlbums(defaultAlbums);
      setSelectedAlbum('Blog');
    }
  }, []);

  // Manejar carga de archivo
  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setError('');

    // Crear FormData para la API de imgBB
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', IMGBB_API_KEY);

    if (selectedAlbum) {
      formData.append('album', selectedAlbum);
    }

    try {
      const response = await axios.post('https://api.imgbb.com/1/upload', formData);

      if (response.data && response.data.success) {
        const imageUrl = response.data.data.url;
        onImageUploaded(imageUrl);
      } else {
        setError('Error al subir la imagen. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setError('Error al subir la imagen. Verifica tu conexión a internet.');
    } finally {
      setUploading(false);
    }
  };

  // Manejar selección de archivo desde input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // Manejar arrastrar y soltar
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Manejar soltar archivo
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Manejar pegado de imagen
  const handlePaste = useCallback((e) => {
    const items = e.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        handleFileUpload(file);
        break;
      }
    }
  }, []);

  // Añadir event listener para pegado
  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  // Añadir nuevo álbum
  const addNewAlbum = () => {
    const albumName = prompt('Introduce el nombre del nuevo álbum:');
    if (albumName && albumName.trim() !== '') {
      const newAlbums = [...albums, albumName.trim()];
      localStorage.setItem('imgbb_albums', JSON.stringify(newAlbums));
      setAlbums(newAlbums);
      setSelectedAlbum(albumName.trim());
    }
  };

  return (
    <div className="mb-6">
      <label className="form-label">Subir imagen</label>

      <div className="flex flex-col space-y-4">
        {/* Selector de álbum */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            className="form-input flex-grow"
          >
            {albums.map(album => (
              <option key={album} value={album}>{album}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={addNewAlbum}
            className="btn btn-outline"
          >
            + Nuevo álbum
          </button>
        </div>

        {/* Área de arrastrar y soltar */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900 dark:bg-opacity-20'
            : 'border-gray-300 dark:border-gray-600'
            }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <UploadIcon className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
            <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
              {uploading ? 'Subiendo...' : 'Arrastra y suelta una imagen aquí, o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              También puedes pegar una imagen desde el portapapeles (Ctrl+V)
            </p>

            {error && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className="mt-4 btn btn-outline cursor-pointer"
            >
              Seleccionar imagen
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal del editor
export default function Editor() {
  const router = useRouter();
  const [type, setType] = useState('post');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Estado para post
  const [postData, setPostData] = useState({
    id: '',
    title: '',
    slug: '',
    date: new Date().toISOString().split('T')[0],
    author: 'Reychango',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: ''
  });

  // Estado para foto
  const [photoData, setPhotoData] = useState({
    id: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    url: '',
    thumbnailUrl: '',
    album: 'Blog'
  });

  // Verificar autenticación al cargar la página
  useEffect(() => {
    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  // Cargar contenido existente si se proporciona un ID o slug
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const { type, file, id, slug } = router.query;

    if (type) {
      setType(type);
    }

    if ((type === 'post' && (file || slug)) || (type === 'photo' && id)) {
      loadExistingContent();
    } else {
      setLoading(false);
    }
  }, [router.query, isAuthenticated]);

  // Cargar contenido existente
  const loadExistingContent = async () => {
    setLoading(true);

    try {
      const { type, file, id, slug } = router.query;

      if (type === 'post' && (file || slug)) {
        // Cargar post por slug
        try {
          const slugToUse = file || slug;
          const response = await apiClient.get(`/api/posts/${slugToUse}`);
          if (response.data) {
            setPostData({
              ...response.data,
              tags: response.data.tags ? response.data.tags.join(', ') : ''
            });
          }
          setLoading(false);
        } catch (error) {
          console.error('Error al cargar el post:', error);
          setMessage({
            type: 'error',
            text: error.response?.data?.message || error.message || 'Error al cargar el post. Inténtalo de nuevo.'
          });
          setLoading(false);
        }
      } else if (type === 'photo' && id) {
        // Cargar foto por ID
        try {
          const response = await apiClient.get(`/api/photos/${id}`);
          if (response.data) {
            setPhotoData(response.data);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error al cargar la foto:', error);
          setMessage({
            type: 'error',
            text: error.response?.data?.message || error.message || 'Error al cargar la foto. Inténtalo de nuevo.'
          });
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error al cargar el contenido:', error);
      setMessage({
        type: 'error',
        text: 'Error al cargar el contenido. Inténtalo de nuevo.'
      });
      setLoading(false);
    }
  };

  // Manejar cambios en los campos de post
  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en el contenido del editor Markdown
  const handleEditorChange = (value) => {
    setPostData(prev => ({ ...prev, content: value }));
  };

  // Manejar cambios en los campos de foto
  const handlePhotoChange = (e) => {
    const { name, value } = e.target;
    setPhotoData(prev => ({ ...prev, [name]: value }));
  };

  // Manejar imagen subida para post
  const handlePostImageUploaded = (imageUrl) => {
    setPostData(prev => ({ ...prev, coverImage: imageUrl }));

    // Insertar la imagen en el contenido si está enfocado el editor
    const textarea = document.querySelector('.CodeMirror textarea');
    if (textarea && document.activeElement === textarea) {
      const imageMarkdown = `![Imagen](${imageUrl})`;
      const cm = textarea.CodeMirror;
      cm.replaceSelection(imageMarkdown);
    }

    setMessage({
      type: 'success',
      text: 'Imagen subida correctamente'
    });

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  // Manejar imagen subida para foto
  const handlePhotoImageUploaded = (imageUrl) => {
    setPhotoData(prev => ({
      ...prev,
      url: imageUrl,
      thumbnailUrl: imageUrl
    }));

    setMessage({
      type: 'success',
      text: 'Imagen subida correctamente'
    });

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setMessage({ type: '', text: '' });
    }, 3000);
  };

  // Guardar post
  const savePostContent = async () => {
    setSaving(true);

    try {
      // Validar campos requeridos
      if (!postData.title || !postData.slug || !postData.content) {
        setMessage({
          type: 'error',
          text: 'Por favor, completa los campos obligatorios (título, slug y contenido)'
        });
        setSaving(false);
        return;
      }

      // Preparar datos para guardar
      const postToSave = {
        ...postData,
        tags: postData.tags ? postData.tags.split(',').map(tag => tag.trim()) : []
      };

      // Guardar post usando función directa de Firestore (cliente)
      await savePost(postToSave);

      setMessage({
        type: 'success',
        text: 'Post guardado correctamente'
      });

      // Redirigir después de guardar
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (error) {
      console.error('Error al guardar el post:', error);
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Error al guardar el post. Inténtalo de nuevo.';
      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setSaving(false);
    }
  };

  // Guardar foto
  const savePhotoContent = async () => {
    setSaving(true);

    try {
      // Validar campos requeridos
      if (!photoData.title || !photoData.url) {
        setMessage({
          type: 'error',
          text: 'Por favor, completa los campos obligatorios (título e imagen)'
        });
        setSaving(false);
        return;
      }

      // Generar ID si es nueva foto
      const photoToSave = {
        ...photoData,
        id: photoData.id || `photo${Date.now()}`
      };

      // Guardar foto usando función directa de Firestore (cliente)
      await savePhoto(photoToSave);

      setMessage({
        type: 'success',
        text: 'Foto guardada correctamente'
      });

      // Redirigir después de guardar
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (error) {
      console.error('Error al guardar la foto:', error);
      const errorMessage = error.response?.data?.message ||
        error.message ||
        'Error al guardar la foto. Inténtalo de nuevo.';
      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setSaving(false);
    }
  };

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return null; // No mostrar nada mientras se redirige
  }

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <LoadingSpinner
        size="lg"
        text="Cargando editor..."
        fullScreen={true}
      />
    );
  }

  return (
    <>
      <Head>
        <title>
          {type === 'post'
            ? `${postData.slug ? 'Editar' : 'Nuevo'} Post - Los desvaríos de Reychango`
            : `${photoData.id ? 'Editar' : 'Nueva'} Foto - Los desvaríos de Reychango`}
        </title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-4xl mx-auto">
        {/* Mostrar mensajes de éxito o error */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}>
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            {type === 'post'
              ? `${postData.slug ? 'Editar' : 'Nuevo'} Post`
              : `${photoData.id ? 'Editar' : 'Nueva'} Foto`}
          </h1>

          <div className="flex items-center space-x-4">
            <Link href="/admin" className="btn btn-outline">
              Cancelar
            </Link>
            <button
              onClick={type === 'post' ? savePostContent : savePhotoContent}
              disabled={saving}
              className="btn btn-primary flex items-center"
            >
              {saving ? (
                <span className="inline-block animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
              ) : (
                <SaveIcon className="w-5 h-5 mr-2" />
              )}
              Guardar
            </button>
          </div>
        </div>

        {/* Formulario para post */}
        {type === 'post' && (
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="form-label">Título <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={postData.title}
                  onChange={handlePostChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="slug" className="form-label">Slug <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={postData.slug}
                  onChange={handlePostChange}
                  className="form-input"
                  required
                  placeholder="url-amigable-del-post"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="form-label">Fecha</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={postData.date}
                  onChange={handlePostChange}
                  className="form-input"
                />
              </div>

              <div>
                <label htmlFor="author" className="form-label">Autor</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={postData.author}
                  onChange={handlePostChange}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="excerpt" className="form-label">Extracto</label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={postData.excerpt}
                onChange={handlePostChange}
                className="form-input"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label htmlFor="tags" className="form-label">Etiquetas (separadas por comas)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={postData.tags}
                onChange={handlePostChange}
                className="form-input"
                placeholder="tecnología, personal, reflexiones"
              />
            </div>

            <div>
              <label htmlFor="coverImage" className="form-label">Imagen de portada</label>
              <input
                type="text"
                id="coverImage"
                name="coverImage"
                value={postData.coverImage}
                onChange={handlePostChange}
                className="form-input"
                placeholder="URL de la imagen"
              />
              {postData.coverImage && (
                <div className="mt-2 relative h-40 w-full md:w-1/2 rounded-md overflow-hidden">
                  <img
                    src={postData.coverImage}
                    alt="Vista previa"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
            </div>

            <ImageUploader onImageUploaded={handlePostImageUploaded} />

            <div>
              <label htmlFor="content" className="form-label">Contenido <span className="text-red-500">*</span></label>
              <SimpleMDE
                value={postData.content}
                onChange={handleEditorChange}
                options={{
                  spellChecker: false,
                  placeholder: 'Escribe el contenido de tu post en formato Markdown...',
                  status: ['lines', 'words', 'cursor'],
                  autosave: {
                    enabled: true,
                    delay: 1000,
                    uniqueId: `post-${postData.slug || 'new'}`
                  }
                }}
              />
            </div>
          </form>
        )}

        {/* Formulario para foto */}
        {type === 'photo' && (
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="form-label">Título <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={photoData.title}
                  onChange={handlePhotoChange}
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label htmlFor="album" className="form-label">Álbum</label>
                <input
                  type="text"
                  id="album"
                  name="album"
                  value={photoData.album}
                  onChange={handlePhotoChange}
                  className="form-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="form-label">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={photoData.description}
                onChange={handlePhotoChange}
                className="form-input"
                rows="3"
              ></textarea>
            </div>

            <div>
              <label htmlFor="date" className="form-label">Fecha</label>
              <input
                type="date"
                id="date"
                name="date"
                value={photoData.date}
                onChange={handlePhotoChange}
                className="form-input"
              />
            </div>

            <div>
              <label htmlFor="url" className="form-label">URL de la imagen <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="url"
                name="url"
                value={photoData.url}
                onChange={handlePhotoChange}
                className="form-input"
                placeholder="URL de la imagen"
                required
              />
              {photoData.url && (
                <div className="mt-2 relative h-60 w-full md:w-2/3 rounded-md overflow-hidden">
                  <img
                    src={photoData.url}
                    alt="Vista previa"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>

            <ImageUploader onImageUploaded={handlePhotoImageUploaded} />
          </form>
        )}
      </div>
    </>
  );
}
