import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import OptimizedImage from '../components/OptimizedImage';
import { getPosts, getPopularTags } from '../lib/api';

export default function Home({ latestPosts, popularTags }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>Los desvaríos de Reychango - Inicio</title>
        <meta name="description" content="Desvaríos desvariados - Blog personal de Reychango" />
      </Head>

      {/* Hero Section Mejorado */}
      <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-accent-500 via-primary-500 to-secondary-500 text-white overflow-hidden">
        {/* Efectos de fondo decorativos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className={`flex flex-col items-center text-center transition-all duration-1000 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="mb-8 w-48 h-48 md:w-56 md:h-56 relative animate-fade-in-up">
              <OptimizedImage 
                src="/img/logo.jpg" 
                alt="Reychango Logo" 
                width={224}
                height={224}
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 ring-4 ring-white/20"
                priority
              />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-shadow-lg animate-fade-in-up animation-delay-200">
              Los desvaríos de Reychango
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-2xl opacity-95 animate-fade-in-up animation-delay-400">
              Desvaríos desvariados sobre la vida, el universo y todo lo demás
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
              <Link 
                href="/blog" 
                className="btn btn-primary bg-white text-accent-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                Explorar artículos
                <svg className="w-5 h-5 ml-2 inline" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link 
                href="/fotos" 
                className="btn btn-outline border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg font-semibold"
              >
                Ver galería
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Últimos artículos</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Descubre mis más recientes desvaríos y reflexiones sobre la vida, el universo y todo lo demás.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post, index) => (
              <article 
                key={post.slug} 
                className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <OptimizedImage
                    src={post.coverImage || '/img/default-post.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay con información al hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.tags.slice(0, 2).map(tag => (
                            <span 
                              key={tag}
                              className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {post.formattedDate || post.date}
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1">
                        {post.tags.slice(0, 1).map(tag => (
                          <span 
                            key={tag}
                            className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-800 dark:hover:text-primary-300 inline-flex items-center group/link"
                  >
                    Leer más
                    <svg className="w-4 h-4 ml-2 transform group-hover/link:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/blog" className="btn btn-outline border-primary-500 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-gray-800">
              Ver todos los artículos
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Galería de fotos</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Explora mi colección de imágenes y momentos capturados.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Imágenes existentes y de Picsum.photos */}
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
              <OptimizedImage
                src="/img/logo.jpg"
                alt="Foto 1"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
              <OptimizedImage
                src="/img/default-post.jpg"
                alt="Foto 2"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
              <OptimizedImage
                src="/img/placeholder-1.jpg"
                alt="Foto 3"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
              <OptimizedImage
                src="https://picsum.photos/id/1015/400/400"
                alt="Foto 4"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
              <OptimizedImage
                src="https://picsum.photos/id/1018/400/400"
                alt="Foto 5"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
              <OptimizedImage
                src="https://picsum.photos/id/1019/400/400"
                alt="Foto 6"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
              <OptimizedImage
                src="https://picsum.photos/id/1022/400/400"
                alt="Foto 7"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer">
              <OptimizedImage
                src="https://picsum.photos/id/1025/400/400"
                alt="Foto 8"
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/fotos" className="btn btn-outline border-primary-500 text-primary-600 hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:hover:bg-gray-800">
              Ver galería completa
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Categorías</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Explora mis desvaríos por temas de interés.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTags.length > 0 ? (
              popularTags.map((tag) => (
                <div key={tag.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">{tag.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {tag.count} {tag.count === 1 ? 'artículo' : 'artículos'} con esta etiqueta
                  </p>
                  <Link 
                    href={`/blog?tag=${encodeURIComponent(tag.name)}`} 
                    className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-800 dark:hover:text-primary-300"
                  >
                    Ver artículos
                  </Link>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Tecnología</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Reflexiones sobre el impacto de la tecnología en nuestras vidas.</p>
                  <Link href="/blog" className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-800 dark:hover:text-primary-300">
                    Ver artículos
                  </Link>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Creatividad</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Exploración de procesos creativos y expresión artística.</p>
                  <Link href="/blog" className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-800 dark:hover:text-primary-300">
                    Ver artículos
                  </Link>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 text-center">
                  <h3 className="text-xl font-bold mb-2">Bienestar</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Ideas para cultivar una vida más plena y consciente.</p>
                  <Link href="/blog" className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-800 dark:hover:text-primary-300">
                    Ver artículos
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export async function getStaticProps() {
  try {
    const allPosts = await getPosts();
    // Asegurarse de que allPosts sea un array
    const postsArray = Array.isArray(allPosts) ? allPosts : [];
    const latestPosts = postsArray.slice(0, 3);
    const popularTags = await getPopularTags(3); // Obtener las 3 etiquetas más populares

    return {
      props: {
        latestPosts,
        popularTags,
      },
      // Revalidar la página cada 10 segundos para reflejar cambios en Firestore
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error al obtener datos para la página principal:', error);
    // En caso de error, devolver arrays vacíos
    return {
      props: {
        latestPosts: [],
        popularTags: [],
      },
      revalidate: 10,
    };
  }
}
