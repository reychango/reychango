import '../styles/globals.css';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import ToastContainer from '../components/ToastContainer';

function MyApp({ Component, pageProps }) {
  const [darkMode, setDarkMode] = useState(true); // Iniciar con modo oscuro por defecto

  useEffect(() => {
    // Verificar si el usuario prefiere el modo oscuro
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        setDarkMode(savedMode === 'true');
      } else {
        // Usar preferencias del sistema, pero priorizar el modo oscuro
        setDarkMode(true);
      }
    }
  }, []);

  useEffect(() => {
    // Aplicar el modo oscuro al documento
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Guardar preferencia
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ErrorBoundary>
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
        <Component {...pageProps} darkMode={darkMode} />
        <ToastContainer />
      </Layout>
    </ErrorBoundary>
  );
}

export default MyApp;
