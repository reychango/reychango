import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts, getPopularTags } from '../lib/api';

export default function Home({ latestPosts, popularTags }) {
  return (
    <>
      <Head>
        <title>Los desvaríos de Reychango - Inicio</title>
        <meta name="description" content="Desvaríos desvariados - Blog personal de Reychango" />
      </Head>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-accent-500 via-primary-500 to-secondary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center">
            <div className="mb-6 w-48 h-48 relative">
              <Image 
                src="/img/logo.jpg" 
                alt="Reychango Logo" 
                width={192} 
                height={192}
                className="rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">Los desvaríos de Reychango</h1>
            <Link href="/blog" className="btn btn-primary bg-white text-accent-600 hover:bg-gray-100 shadow-md">
              Explorar artículos
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Últimos artículos</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Descubre mis más recientes desvaríos y reflexiones sobre la vida, el universo y todo lo demás.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <article key={post.slug} className="card hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 w-full">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Image
                      src="/img/default-post.jpg"
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{post.date}</div>
                  <h3 className="text-xl font-bold mb-2 hover:text-primary-600 dark:hover:text-primary-400">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-800 dark:hover:text-primary-300 inline-flex items-center"
                  >
                    Leer más
                    <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Galería de fotos</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Explora mi colección de imágenes y momentos capturados.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Imágenes existentes y de Picsum.photos */}
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Image
                src="/img/logo.jpg"
                alt="Foto 1"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Image
                src="/img/default-post.jpg"
                alt="Foto 2"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Image
                src="/img/placeholder-1.jpg"
                alt="Foto 3"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Image
                src="https://picsum.photos/id/1015/400/400"
                alt="Foto 4"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Image
                src="https://picsum.photos/id/1018/400/400"
                alt="Foto 5"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Image
                src="https://picsum.photos/id/1019/400/400"
                alt="Foto 6"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Image
                src="https://picsum.photos/id/1022/400/400"
                alt="Foto 7"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Image
                src="https://picsum.photos/id/1025/400/400"
                alt="Foto 8"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
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
      <section className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Categorías</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Explora mis desvaríos por temas de interés.</p>
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
