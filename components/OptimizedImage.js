import Image from 'next/image';
import { useState, useEffect } from 'react';

/**
 * Componente de imagen optimizada con lazy loading
 * Wrapper mejorado alrededor de Next.js Image con mejor manejo de errores
 * 
 * NOTA: Cuando se usa `fill`, el contenedor padre DEBE tener `position: relative`
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  ...props
}) {
  const [hasError, setHasError] = useState(false);
  
  // Normalizar el src - siempre tener un valor valido
  const normalizedSrc = src && src.trim() !== '' ? src : '/img/default-post.jpg';
  const [imageSrc, setImageSrc] = useState(normalizedSrc);

  // Actualizar src cuando cambia el prop
  useEffect(() => {
    const newSrc = src && typeof src === 'string' && src.trim() !== '' ? src : '/img/default-post.jpg';
    if (newSrc !== imageSrc) {
      setImageSrc(newSrc);
      setHasError(false);
    }
  }, [src]); // Solo dependencia de src para evitar loops

  // Manejar errores de carga
  const handleError = () => {
    if (!hasError && imageSrc !== '/img/default-post.jpg') {
      console.warn('Error al cargar imagen, usando fallback:', imageSrc);
      setHasError(true);
      setImageSrc('/img/default-post.jpg');
    }
  };

  // Preparar props base - simplificado para maxima compatibilidad
  const imageProps = {
    src: imageSrc,
    alt: alt || 'Imagen',
    className: className,
    onError: handleError,
    loading: priority ? undefined : 'lazy',
    priority: priority,
    unoptimized: props.unoptimized !== undefined ? props.unoptimized : true,
    ...props
  };

  // Si se usa fill
  if (fill) {
    imageProps.fill = true;
    return <Image {...imageProps} />;
  }

  // Para imagenes sin fill
  imageProps.width = width || 800;
  imageProps.height = height || 600;

  return <Image {...imageProps} />;
}
