import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import OptimizedImage from './OptimizedImage';
import { MoonIcon, SunIcon, MenuIcon, XIcon } from './Icons';

export default function Header({ darkMode, toggleDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <header className="bg-gradient-to-r from-primary-500/90 to-secondary-500/90 backdrop-blur-sm shadow-lg sticky top-0 z-50 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 overflow-hidden rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
              <OptimizedImage
                src="/img/logo.jpg" 
                alt="Reychango Logo" 
                width={40}
                height={40}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-yellow-200 transition-colors">
              Los desvaríos de Reychango
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md transition-all ${
                isActive('/') 
                  ? 'bg-white/20 text-yellow-200 font-semibold' 
                  : 'text-white hover:text-yellow-200 hover:bg-white/10'
              }`}
            >
              Inicio
            </Link>
            <Link 
              href="/blog" 
              className={`px-3 py-2 rounded-md transition-all ${
                isActive('/blog') || router.pathname.startsWith('/blog/')
                  ? 'bg-white/20 text-yellow-200 font-semibold' 
                  : 'text-white hover:text-yellow-200 hover:bg-white/10'
              }`}
            >
              Blog
            </Link>
            <Link 
              href="/fotos" 
              className={`px-3 py-2 rounded-md transition-all ${
                isActive('/fotos')
                  ? 'bg-white/20 text-yellow-200 font-semibold' 
                  : 'text-white hover:text-yellow-200 hover:bg-white/10'
              }`}
            >
              Fotos
            </Link>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleDarkMode}
              className="p-2 mr-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md bg-white/10 hover:bg-white/20 text-white"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? 
                <XIcon className="w-6 h-6" /> : 
                <MenuIcon className="w-6 h-6" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className={`px-3 py-2 rounded-md transition-all ${
                  isActive('/')
                    ? 'bg-white/20 text-yellow-200 font-semibold'
                    : 'hover:bg-white/10 text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/blog" 
                className={`px-3 py-2 rounded-md transition-all ${
                  isActive('/blog') || router.pathname.startsWith('/blog/')
                    ? 'bg-white/20 text-yellow-200 font-semibold'
                    : 'hover:bg-white/10 text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/fotos" 
                className={`px-3 py-2 rounded-md transition-all ${
                  isActive('/fotos')
                    ? 'bg-white/20 text-yellow-200 font-semibold'
                    : 'hover:bg-white/10 text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Fotos
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
