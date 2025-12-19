/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ibb.co', 'picsum.photos', 'images.unsplash.com', 'via.placeholder.com'], // Permitir imágenes desde imgBB, Picsum.photos, Unsplash y Placeholder
    unoptimized: true, // Desactivar la optimización de imágenes para permitir imágenes locales
  },
  env: {
    // Variables de entorno públicas - usar variables de entorno del sistema
    SITE_NAME: process.env.SITE_NAME || 'Los desvaríos de Reychango',
    IMGBB_API_KEY: process.env.IMGBB_API_KEY,
  },
}

module.exports = nextConfig
