/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.ibb.co', 'picsum.photos', 'images.unsplash.com', 'via.placeholder.com'], // Permitir imágenes desde imgBB, Picsum.photos, Unsplash y Placeholder
    unoptimized: true, // Desactivar la optimización de imágenes para permitir imágenes locales
  },
  env: {
    // Variables de entorno públicas
    SITE_NAME: 'Los desvaríos de Reychango',
    IMGBB_API_KEY: '96c8ea0e1e8b9c022b4dcbf65d002d15',
  },
}

module.exports = nextConfig
