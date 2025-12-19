/**
 * Componente reutilizable para mostrar estados de carga
 * Úsalo para indicar que algo se está cargando
 */

export default function LoadingSpinner({ 
  size = 'md', 
  text = 'Cargando...',
  fullScreen = false 
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 rounded-full animate-spin`}
      />
      {text && (
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

