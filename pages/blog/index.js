import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import OptimizedImage from '../../components/OptimizedImage';
import { getPosts } from '../../lib/api';

export default function Blog({ posts }) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  
  // Calcular posts para la página actual
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Calcular total de páginas
  const totalPages = Math.ceil(posts.length / postsPerPage);
  
  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <>
      <Head>
        <title>Blog - Los desvaríos de Reychango</title>
        <meta name="description" content="Artículos y reflexiones en el blog Los desvaríos de Reychango" />
      </Head>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Bienvenido a mi blog personal. Aquí encontrarás mis reflexiones, experiencias y, por supuesto, desvaríos sobre diversos temas.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {currentPosts.map((post, index) => (
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
                      <div className="flex flex-wrap gap-2">
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
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 1).map(tag => (
                        <span 
                          key={tag} 
                          className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
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
              </div>
            </article>
          ))}
        </div>
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mb-10">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'
              }`}
            >
              Anterior
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-primary-500 text-white dark:bg-primary-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-primary-500 text-white hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-700'
              }`}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const posts = await getPosts();
  
  return {
    props: {
      posts,
    },
    // Revalidar la página cada 10 segundos para reflejar cambios en Firestore
    revalidate: 10,
  };
}
