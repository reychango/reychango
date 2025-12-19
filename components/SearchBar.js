import { useState } from 'react';

/**
 * Componente de búsqueda reutilizable
 * Útil para filtrar contenido en listas y tablas
 */
export default function SearchBar({ 
  placeholder = 'Buscar...', 
  onSearch,
  className = '',
  debounceMs = 300 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Limpiar el timer anterior
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Crear nuevo timer para debounce
    const newTimer = setTimeout(() => {
      if (onSearch) {
        onSearch(value);
      }
    }, debounceMs);

    setDebounceTimer(newTimer);
  };

  const handleClear = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white"
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Limpiar búsqueda"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

