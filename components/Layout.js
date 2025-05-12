import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, darkMode, toggleDarkMode }) {
  return (
    <>
      <Head>
        <title>Los desvaríos de Reychango</title>
        <meta name="description" content="Desvaríos desvariados - Blog personal de Reychango" />
        <link rel="icon" href="/img/logo.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
}
