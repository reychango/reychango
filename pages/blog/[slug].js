import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import OptimizedImage from '../../components/OptimizedImage';
import { getPosts, getPostBySlug, likePost } from '../../lib/api';

export default function Post({ post }) {
  const router = useRouter();
  const [likes, setLikes] = useState(post?.likes || 0);
  const [isLiked, setIsLiked] = useState(false);

  // Cargar estado de "like" desde localStorage al montar el componente
  useEffect(() => {
    if (post && post.slug) {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      if (likedPosts[post.slug]) {
        setIsLiked(true);
      }
    }
  }, [post]);

  const handleLike = async () => {
    if (isLiked) return;

    // Actualización optimista
    setLikes(prev => prev + 1);
    setIsLiked(true);

    const success = await likePost(post.id);

    if (success) {
      // Guardar en localStorage para persistencia
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '{}');
      likedPosts[post.slug] = true;
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    } else {
      // Revertir en caso de error
      setLikes(prev => prev - 1);
      setIsLiked(false);
    }
  };

  // Si la página está en fallback
  if (router.isFallback) {
    return <div className="container mx-auto px-4 py-10 text-center">Cargando...</div>;
  }

  // Si no se encontró el post
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-6">Post no encontrado</h1>
        <p className="mb-6">Lo sentimos, el post que buscas no existe o ha sido eliminado.</p>
        <Link href="/blog" className="btn btn-primary">
          Volver al blog
        </Link>
      </div>
    );
  }

  // Función para ir al editor con el contenido del post
  const handleEdit = () => {
    router.push({
      pathname: '/admin/editor',
      query: {
        type: 'post',
        id: post.id,
        slug: post.slug
      }
    });
  };

  // Generar URL completa para compartir
  const siteUrl = 'https://reychango.es'; // URL base del sitio (dominio personalizado)
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const shareImage = post.coverImage || `${siteUrl}/img/logo.jpg`;

  return (
    <>
      <Head>
        <title>{post.title} - Los desvaríos de Reychango</title>
        <meta name="description" content={post.excerpt} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={shareImage} />
        <meta property="og:site_name" content="Los desvaríos de Reychango" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={postUrl} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={shareImage} />

        {/* Canonical URL */}
        <link rel="canonical" href={postUrl} />

        {/* JSON-LD Structured Data for Article */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              image: shareImage,
              datePublished: post.date,
              dateModified: post.updatedAt || post.date,
              author: {
                '@type': 'Person',
                name: post.author || 'Reychango',
                url: siteUrl,
              },
              publisher: {
                '@type': 'Organization',
                name: 'Los desvaríos de Reychango',
                logo: {
                  '@type': 'ImageObject',
                  url: `${siteUrl}/img/logo.jpg`,
                },
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': postUrl,
              },
              keywords: post.tags ? post.tags.join(', ') : '',
            }),
          }}
        />
      </Head>

      <article className="max-w-3xl mx-auto">
        {/* Cabecera del post */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Volver al blog
            </Link>

            <button
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Editar
            </button>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
            <span>{post.formattedDate}</span>
            <span className="mx-2">•</span>
            <span>{post.author}</span>
          </div>

          <div className="relative h-64 md:h-96 w-full mb-10 rounded-xl overflow-hidden shadow-2xl bg-gray-200 dark:bg-gray-700">
            <OptimizedImage
              src={post.coverImage || '/img/default-post.jpg'}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Contenido del post */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-serif prose-p:leading-relaxed prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg">
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
        </div>

        {/* Botón de Like / Feedback */}
        <div className="mt-12 flex flex-col items-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-inner">
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">¿Te ha gustado este desvarío?</p>
          <button
            onClick={handleLike}
            disabled={isLiked}
            className={`flex items-center gap-3 px-8 py-3 rounded-full font-bold transition-all duration-300 transform ${isLiked
              ? 'bg-rose-500 text-white cursor-default scale-105'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:scale-110 hover:shadow-xl border border-gray-200 dark:border-gray-600 active:scale-95'
              }`}
          >
            <svg
              className={`w-6 h-6 transition-colors duration-300 ${isLiked ? 'fill-current' : 'fill-none stroke-current stroke-2'}`}
              viewBox="0 0 24 24"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likes} {likes === 1 ? 'Me gusta' : 'Me gustas'}</span>
          </button>
          {isLiked && (
            <p className="text-xs text-rose-500 mt-3 font-medium animate-fade-in">¡Gracias por tu apoyo! ❤️</p>
          )}
        </div>

        {/* Botones de compartir */}
        <div className="mt-8 flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">Compartir este artículo</p>
          <div className="flex flex-wrap justify-center gap-3">
            {/* Facebook */}
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </a>

            {/* Twitter/X */}
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              X
            </a>

            {/* WhatsApp */}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' - ' + postUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BD5A] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>

            {/* Copiar enlace */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(postUrl);
                alert('¡Enlace copiado al portapapeles!');
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar enlace
            </button>
          </div>
        </div>

        {/* Etiquetas */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Etiquetas
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors text-sm font-medium"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navegación entre posts */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/blog"
            className="btn btn-outline inline-flex items-center group"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Ver todos los posts
          </Link>
        </div>
      </article>
    </>
  );
}

export async function getStaticPaths() {
  const posts = await getPosts();

  // Generar las rutas para cada post
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: true, // Mostrar página de fallback mientras se genera el contenido
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);

  // Si no se encuentra el post, devolver notFound
  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 10, // Regenerar la página cada 10 segundos si hay cambios
  };
}
