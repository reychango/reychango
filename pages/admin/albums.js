import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';
import { SaveIcon, TrashIcon, PlusIcon } from '../../components/Icons';

export default function AlbumsManager() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [albums, setAlbums] = useState([]);
  const [newAlbum, setNewAlbum] = useState({ name: '', description: '', coverImage: '' });
  const [editingAlbum, setEditingAlbum] = useState(null);

  // Verificar autenticación al cargar la página
  useEffect(() => {
    const token = Cookies.get('auth_token');
    if (token) {
      setIsAuthenticated(true);
      loadAlbums();
    } else {
      router.push('/admin');
    }
  }, [router]);

  // Cargar álbumes
  const loadAlbums = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/albums');
      if (response.data) {
        setAlbums(response.data);
      }
    } catch (error) {
      console.error('Error al cargar los álbumes:', error);
      setMessage({
        type: 'error',
        text: 'Error al cargar los álbumes. Inténtalo de nuevo.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario de nuevo álbum
  const handleNewAlbumChange = (e) => {
    const { name, value } = e.target;
    setNewAlbum(prev => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en el formulario de edición de álbum
  const handleEditAlbumChange = (e) => {
    const { name, value } = e.target;
    setEditingAlbum(prev => ({ ...prev, [name]: value }));
  };

  // Crear nuevo álbum
  const createAlbum = async () => {
    if (!newAlbum.name) {
      setMessage({
        type: 'error',
        text: 'El nombre del álbum es obligatorio'
      });
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post('/api/albums/save', newAlbum);
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Álbum creado correctamente'
        });
        setNewAlbum({ name: '', description: '', coverImage: '' });
        loadAlbums();
      } else {
        setMessage({
          type: 'error',
          text: response.data.message || 'Error al crear el álbum'
        });
      }
    } catch (error) {
      console.error('Error al crear el álbum:', error);
      setMessage({
        type: 'error',
        text: 'Error al crear el álbum. Inténtalo de nuevo.'
      });
    } finally {
      setSaving(false);
    }
  };

  // Guardar cambios en un álbum
  const saveAlbum = async () => {
    if (!editingAlbum || !editingAlbum.name) {
      setMessage({
        type: 'error',
        text: 'El nombre del álbum es obligatorio'
      });
      return;
    }

    setSaving(true);
    try {
      const response = await axios.post('/api/albums/save', editingAlbum);
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Álbum actualizado correctamente'
        });
        setEditingAlbum(null);
        loadAlbums();
      } else {
        setMessage({
          type: 'error',
          text: response.data.message || 'Error al actualizar el álbum'
        });
      }
    } catch (error) {
      console.error('Error al actualizar el álbum:', error);
      setMessage({
        type: 'error',
        text: 'Error al actualizar el álbum. Inténtalo de nuevo.'
      });
    } finally {
      setSaving(false);
    }
  };

  // Eliminar un álbum
  const deleteAlbum = async (albumName) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el álbum "${albumName}"? Esta acción no eliminará las fotos asociadas, pero las dejará sin álbum.`)) {
      return;
    }

    try {
      const response = await axios.delete(`/api/albums/${encodeURIComponent(albumName)}`);
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Álbum eliminado correctamente'
        });
        loadAlbums();
      } else {
        setMessage({
          type: 'error',
          text: response.data.message || 'Error al eliminar el álbum'
        });
      }
    } catch (error) {
      console.error('Error al eliminar el álbum:', error);
      setMessage({
        type: 'error',
        text: 'Error al eliminar el álbum. Inténtalo de nuevo.'
      });
    }
  };

  // Iniciar edición de un álbum
  const startEditing = (album) => {
    setEditingAlbum(album);
  };

  // Cancelar edición
  const cancelEditing = () => {
    setEditingAlbum(null);
  };

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return null;
  }

  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Gestión de Álbumes - Los desvaríos de Reychango</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Gestión de Álbumes</h1>
          
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="btn btn-outline text-white">
              Volver al Panel
            </Link>
          </div>
        </div>

        {/* Mensaje de éxito o error */}
        {message.text && (
          <div
            className={`p-4 mb-6 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Formulario para crear nuevo álbum */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Crear Nuevo Álbum</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="form-label text-gray-700">Nombre <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={newAlbum.name}
                onChange={handleNewAlbumChange}
                className="form-input text-gray-800"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="form-label text-gray-700">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={newAlbum.description}
                onChange={handleNewAlbumChange}
                className="form-input text-gray-800"
                rows="2"
              ></textarea>
            </div>
            <div>
              <label htmlFor="coverImage" className="form-label text-gray-700">Imagen de portada (URL)</label>
              <input
                type="text"
                id="coverImage"
                name="coverImage"
                value={newAlbum.coverImage}
                onChange={handleNewAlbumChange}
                className="form-input text-gray-800"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <button
              onClick={createAlbum}
              disabled={saving}
              className="btn btn-primary flex items-center"
            >
              {saving ? (
                <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
              ) : (
                <PlusIcon className="w-5 h-5 mr-2" />
              )}
              Crear Álbum
            </button>
          </div>
        </div>

        {/* Lista de álbumes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Álbumes Existentes</h2>
          
          {albums.length === 0 ? (
            <p className="text-gray-500">No hay álbumes creados todavía.</p>
          ) : (
            <div className="space-y-6">
              {albums.map((album) => (
                <div key={album.name} className="border rounded-lg p-4">
                  {editingAlbum && editingAlbum.name === album.name ? (
                    // Formulario de edición
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="edit-name" className="form-label text-gray-700">Nombre <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          id="edit-name"
                          name="name"
                          value={editingAlbum.name}
                          onChange={handleEditAlbumChange}
                          className="form-input text-gray-800"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="edit-description" className="form-label text-gray-700">Descripción</label>
                        <textarea
                          id="edit-description"
                          name="description"
                          value={editingAlbum.description || ''}
                          onChange={handleEditAlbumChange}
                          className="form-input text-gray-800"
                          rows="2"
                        ></textarea>
                      </div>
                      <div>
                        <label htmlFor="edit-coverImage" className="form-label text-gray-700">Imagen de portada (URL)</label>
                        <input
                          type="text"
                          id="edit-coverImage"
                          name="coverImage"
                          value={editingAlbum.coverImage || ''}
                          onChange={handleEditAlbumChange}
                          className="form-input text-gray-800"
                          placeholder="https://ejemplo.com/imagen.jpg"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={saveAlbum}
                          disabled={saving}
                          className="btn btn-primary flex items-center"
                        >
                          {saving ? (
                            <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                          ) : (
                            <SaveIcon className="w-5 h-5 mr-2" />
                          )}
                          Guardar
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="btn btn-outline"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Vista normal
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">{album.name}</h3>
                          {album.description && (
                            <p className="text-gray-600 mt-1">{album.description}</p>
                          )}
                          <p className="text-sm text-gray-500 mt-2">
                            {album.count} {album.count === 1 ? 'foto' : 'fotos'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditing(album)}
                            className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteAlbum(album.name)}
                            className="btn btn-sm bg-red-500 hover:bg-red-600 text-white flex items-center"
                          >
                            <TrashIcon className="w-4 h-4 mr-1" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                      {album.coverImage && (
                        <div className="mt-3">
                          <img
                            src={album.coverImage}
                            alt={`Portada del álbum ${album.name}`}
                            className="w-24 h-24 object-cover rounded"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
