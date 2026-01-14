import { getPosts } from '../lib/api';

const SITE_URL = 'https://reychango.es';

function generateSiteMap(posts) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Páginas estáticas -->
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/fotos</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Posts del blog -->
  ${posts
            .map((post) => {
                return `
  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt || post.date || new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
            })
            .join('')}
</urlset>`;
}

function SiteMap() {
    // Este componente no renderiza nada en el navegador
    return null;
}

export async function getServerSideProps({ res }) {
    // Obtener todos los posts
    const posts = await getPosts();

    // Generar el sitemap XML
    const sitemap = generateSiteMap(posts);

    // Configurar cabeceras para XML
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');

    // Escribir el sitemap
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
}

export default SiteMap;
