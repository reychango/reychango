import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import { getPosts, getPostBySlug } from '../../lib/api';

export default function Post({ post }) {
  const router = useRouter();

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
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Volver al blog
            </Link>
            
            <button 
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
          
          {post.coverImage ? (
            <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="relative h-64 md:h-96 w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src="/img/default-post.jpg"
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
        
        {/* Contenido del post */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        
        {/* Etiquetas */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3">Etiquetas:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Navegación entre posts */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <Link 
            href="/blog" 
            className="btn btn-outline"
          >
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
