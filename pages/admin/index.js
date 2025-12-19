import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { getPosts, getPhotos } from '../../lib/api';
import { signIn, signOut, getCurrentUser } from '../../lib/auth';
import { EditIcon, TrashIcon, PlusIcon, PhotoIcon, DocumentIcon } from '../../components/Icons';
import SearchBar from '../../components/SearchBar';

// Componente principal del panel de administración
export default function Admin({ posts, photos }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { type, file } = router.query;

  // Verificar autenticación al cargar la página
  useEffect(() => {
    checkAuth();
  }, []);

  // Función para verificar el estado de autenticación
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar inicio de sesión con Firebase Auth
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    try {
      const result = await signIn(email, password);

      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.user);
        setEmail('');
        setPassword('');
        setError('');
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error inesperado al iniciar sesión');
    }
  };

  // Cerrar sesión con Firebase Auth
  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        setIsAuthenticated(false);
        setUser(null);
      } else {
        setError(result.error || 'Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error en logout:', error);
      setError('Error al cerrar sesión');
    }
  };

  // Si hay parámetros de tipo y archivo, redirigir al editor
  useEffect(() => {
    if (isAuthenticated && type && file) {
      router.push(`/admin/editor?type=${type}&file=${file}`);
    }
  }, [isAuthenticated, type, file, router]);

  // Mostrar loading mientras se verifica autenticación
  if (isLoading) {
    return (
      <>
        <Head>
          <title>Cargando... - Los desvaríos de Reychango</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Verificando autenticación...</p>
          </div>
        </div>
      </>
    );
  }

  // Si no está autenticado, mostrar formulario de login
  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Iniciar sesión - Los desvaríos de Reychango</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <div className="max-w-md mx-auto my-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md border border-red-300 dark:border-red-700">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary py-2 px-4 rounded-md font-medium transition-colors"
              disabled={!email || !password}
            >
              Iniciar sesión
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Nota:</strong> Para usar este panel, necesitas tener una cuenta de Firebase configurada.
              Contacta al administrador para obtener acceso.
            </p>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:underline text-primary-600 dark:text-primary-400">
              Volver al inicio
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Si está autenticado, mostrar panel de administración
  return (
    <>
      <Head>
        <title>Panel de administración - Los desvaríos de Reychango</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Panel de administración</h1>
            {user && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Conectado como: <span className="font-medium">{user.email}</span>
              </p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:underline">
              Ver sitio
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-outline"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md border border-red-300 dark:border-red-700">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Tabs de navegación */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'posts'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              <div className="flex items-center">
                <DocumentIcon className="w-5 h-5 mr-2" />
                Posts
              </div>
            </button>

            <button
              onClick={() => setActiveTab('photos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'photos'
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              <div className="flex items-center">
                <PhotoIcon className="w-5 h-5 mr-2" />
                Fotos
              </div>
            </button>
          </nav>
        </div>

        {/* Botones de acciones rápidas */}
        <div className="mb-8 flex flex-wrap gap-4">
          <Link href="/admin/editor?type=post" className="btn btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Nuevo Post
          </Link>

          <Link href="/admin/editor?type=photo" className="btn btn-primary flex items-center">
            <PlusIcon className="w-5 h-5 mr-2" />
            Nueva Foto
          </Link>

          <Link href="/admin/albums" className="btn btn-secondary flex items-center">
            <PhotoIcon className="w-5 h-5 mr-2" />
            Gestionar Álbumes
          </Link>
        </div>

        {/* Contenido de la pestaña Posts */}
        {activeTab === 'posts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestionar Posts</h2>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6">
              <SearchBar
                placeholder="Buscar posts por título o slug..."
                onSearch={setSearchTerm}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Autor</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {posts
                    .filter((post) => {
                      if (!searchTerm) return true;
                      const search = searchTerm.toLowerCase();
                      return (
                        post.title.toLowerCase().includes(search) ||
                        post.slug.toLowerCase().includes(search) ||
                        (post.author && post.author.toLowerCase().includes(search))
                      );
                    })
                    .map((post) => (
                      <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{post.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">/{post.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {post.formattedDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {post.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <Link
                              href={`/admin/editor?type=post&file=${post.slug}`}
                              className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              <EditIcon className="w-5 h-5" />
                            </Link>
                            <button
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              onClick={() => {
                                if (confirm(`¿Estás seguro de eliminar el post "${post.title}"?`)) {
                                  // Aquí iría la lógica para eliminar el post
                                  alert('Funcionalidad de eliminación no implementada en este ejemplo');
                                }
                              }}
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Contenido de la pestaña Fotos */}
        {activeTab === 'photos' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestionar Fotos</h2>
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-6">
              <SearchBar
                placeholder="Buscar fotos por título o álbum..."
                onSearch={setSearchTerm}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos
                .filter((photo) => {
                  if (!searchTerm) return true;
                  const search = searchTerm.toLowerCase();
                  return (
                    photo.title.toLowerCase().includes(search) ||
                    (photo.album && photo.album.toLowerCase().includes(search)) ||
                    (photo.description && photo.description.toLowerCase().includes(search))
                  );
                })
                .map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="relative aspect-square overflow-hidden rounded-lg shadow-md">
                      <Image
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        fill
                        className="object-cover"
                      />

                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Link
                            href={`/admin/editor?type=photo&file=${photo.id}`}
                            className="p-2 bg-white rounded-full text-primary-600 hover:text-primary-900"
                          >
                            <EditIcon className="w-5 h-5" />
                          </Link>
                          <button
                            className="p-2 bg-white rounded-full text-red-600 hover:text-red-900"
                            onClick={() => {
                              if (confirm(`¿Estás seguro de eliminar la foto "${photo.title}"?`)) {
                                // Aquí iría la lógica para eliminar la foto
                                alert('Funcionalidad de eliminación no implementada en este ejemplo');
                              }
                            }}
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{photo.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{photo.album}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const posts = await getPosts();
  const photos = await getPhotos();

  return {
    props: {
      posts,
      photos,
    },
  };
}
