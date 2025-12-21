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

    const success = await likePost(post.slug);

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

  return (
    <>
      <Head>
        <title>{post.title} - Los desvaríos de Reychango</title>
        <meta name="description" content={post.excerpt} />
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
