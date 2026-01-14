import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import OptimizedImage from '../components/OptimizedImage';
import { getPosts, getPopularTags, getPhotos } from '../lib/api';
import { getFriendLinks } from '../lib/siteConfig';

export default function Home({ latestPosts, popularTags, latestPhotos, friendLinks }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const siteUrl = 'https://reychango.es';

  return (
    <>
      <Head>
        <title>Los desvaríos de Reychango - Inicio</title>
        <meta name="description" content="Desvaríos desvariados sobre la vida, el universo y todo lo demás. Blog personal de Reychango con reflexiones, tecnología, creatividad y bienestar." />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content="Los desvaríos de Reychango" />
        <meta property="og:description" content="Desvaríos desvariados sobre la vida, el universo y todo lo demás. Blog personal de Reychango." />
        <meta property="og:image" content={`${siteUrl}/img/logo.jpg`} />
        <meta property="og:site_name" content="Los desvaríos de Reychango" />
        <meta property="og:locale" content="es_ES" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content="Los desvaríos de Reychango" />
        <meta name="twitter:description" content="Desvaríos desvariados sobre la vida, el universo y todo lo demás." />
        <meta name="twitter:image" content={`${siteUrl}/img/logo.jpg`} />

        {/* Canonical URL */}
        <link rel="canonical" href={siteUrl} />

        {/* JSON-LD Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Los desvaríos de Reychango',
              description: 'Blog personal de Reychango con reflexiones sobre la vida, tecnología, creatividad y bienestar.',
              url: siteUrl,
              author: {
                '@type': 'Person',
                name: 'Reychango',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Los desvaríos de Reychango',
                logo: {
                  '@type': 'ImageObject',
                  url: `${siteUrl}/img/logo.jpg`,
                },
              },
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteUrl}/blog?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </Head>

      {/* Hero Section Mejorado */}
      <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-accent-500 via-primary-500 to-secondary-500 text-white overflow-hidden">
        {/* Efectos de fondo decorativos */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className={`flex flex-col items-center text-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
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
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
            {latestPhotos && latestPhotos.length > 0 ? (
              latestPhotos.map((photo) => (
                <Link
                  key={photo.id}
                  href="/fotos"
                  className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
                >
                  <OptimizedImage
                    src={photo.thumbnailUrl || photo.url || '/img/placeholder-1.jpg'}
                    alt={photo.title || 'Foto de la galería'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium px-2 text-center">{photo.title}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-gray-500">
                No hay fotos disponibles en la galería.
              </div>
            )}
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

      {/* Friend Links Section */}
      {friendLinks && friendLinks.length > 0 && (
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Webs Amigas</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Páginas recomendadas que quizás te interesen.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {friendLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold mr-4 group-hover:scale-110 transition-transform">
                    {link.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-900 dark:text-white font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {link.name}
                    </span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
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

    // Obtener las últimas 8 fotos
    const allPhotos = await getPhotos();
    const photosArray = Array.isArray(allPhotos) ? allPhotos : [];
    const latestPhotos = photosArray.slice(0, 8);

    // Obtener webs amigas
    const friendLinks = await getFriendLinks();

    return {
      props: {
        latestPosts,
        popularTags,
        latestPhotos,
        friendLinks,
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
        latestPhotos: [],
        friendLinks: [],
      },
      revalidate: 10,
    };
  }
}
