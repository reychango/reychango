import Link from 'next/link';
import { useState } from 'react';
import { MoonIcon, SunIcon, MenuIcon, XIcon } from './Icons';

export default function Header({ darkMode, toggleDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-primary-500/90 to-secondary-500/90 backdrop-blur-sm shadow-sm sticky top-0 z-10 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <img 
                src="/img/logo.jpg" 
                alt="Reychango Logo" 
                width="40" 
                height="40" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white">Los desvaríos de Reychango</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-white hover:text-yellow-200 transition-colors">
              Inicio
            </Link>
            <Link href="/blog" className="text-white hover:text-yellow-200 transition-colors">
              Blog
            </Link>
            <Link href="/fotos" className="text-white hover:text-yellow-200 transition-colors">
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
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="px-2 py-1 rounded-md hover:bg-white/10 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/blog" 
                className="px-2 py-1 rounded-md hover:bg-white/10 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/fotos" 
                className="px-2 py-1 rounded-md hover:bg-white/10 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fotos
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
