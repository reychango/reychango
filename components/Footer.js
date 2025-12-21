import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSocialLinks, defaultSocialLinks } from '../lib/siteConfig';

// Configuración de redes sociales - Estos son los valores por defecto si no hay nada en Firestore
const INITIAL_LINKS = {
  facebook: "https://facebook.com/tuperfildefacebook",
  facebookSecondary: "",
  instagram: "https://instagram.com/tuperfildeinstagram",
  threads: "https://threads.net/@tuperfildeinstagram",
  bluesky: "https://bsky.app/profile/tuusuario.bsky.social",
  mastodon: "https://mastodon.social/@tuperfildemastodon",
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [socialLinks, setSocialLinks] = useState(INITIAL_LINKS);

  useEffect(() => {
    async function loadLinks() {
      const dbLinks = await getSocialLinks();
      // Solo sobreescribir si tienen valor real (no vacíos)
      const mergedLinks = { ...INITIAL_LINKS };
      Object.keys(dbLinks).forEach(key => {
        if (dbLinks[key]) mergedLinks[key] = dbLinks[key];
      });
      setSocialLinks(mergedLinks);
    }
    loadLinks();
  }, []);

  return (
    <footer className="bg-gradient-to-r from-primary-500/90 to-secondary-500/90 backdrop-blur-sm shadow-sm text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-8">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 overflow-hidden rounded-full">
                <img
                  src="/img/logo.jpg"
                  alt="Reychango Logo"
                  width="32"
                  height="32"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-white">Los desvaríos de Reychango</h3>
            </div>
            <p className="text-white text-sm opacity-80">Desvaríos desvariados desde {currentYear}</p>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex space-x-4">
              {/* Facebook */}
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-yellow-200 transition-colors"
                  aria-label="Facebook"
                >
                  <img src="/icons/facebook.svg" alt="Facebook" style={{ width: '24px', height: '24px' }} />
                </a>
              )}

              {/* Facebook (segundo perfil) */}
              {socialLinks.facebookSecondary && (
                <a
                  href={socialLinks.facebookSecondary}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-yellow-200 transition-colors"
                  aria-label="Facebook (segundo perfil)"
                >
                  <img src="/icons/facebook.svg" alt="Facebook (segundo perfil)" style={{ width: '24px', height: '24px' }} />
                </a>
              )}

              {/* Instagram */}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-yellow-200 transition-colors"
                  aria-label="Instagram"
                >
                  <img src="/icons/instagram.svg" alt="Instagram" style={{ width: '24px', height: '24px' }} />
                </a>
              )}

              {/* Threads */}
              {socialLinks.threads && (
                <a
                  href={socialLinks.threads}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-yellow-200 transition-colors"
                  aria-label="Threads"
                >
                  <img src="/icons/threads.svg" alt="Threads" style={{ width: '24px', height: '24px' }} />
                </a>
              )}

              {/* Bluesky */}
              {socialLinks.bluesky && (
                <a
                  href={socialLinks.bluesky}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-yellow-200 transition-colors"
                  aria-label="Bluesky"
                >
                  <img src="/icons/bluesky.svg" alt="Bluesky" style={{ width: '24px', height: '24px' }} />
                </a>
              )}

              {/* Mastodon */}
              {socialLinks.mastodon && (
                <a
                  href={socialLinks.mastodon}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-yellow-200 transition-colors"
                  aria-label="Mastodon"
                >
                  <img src="/icons/mastodon.svg" alt="Mastodon" style={{ width: '24px', height: '24px' }} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-white/20 text-center text-sm text-white/80">
          <p> {currentYear} Los desvaríos de Reychango. Todos los derechos reservados.</p>
          <div className="mt-2 flex justify-center space-x-4 pb-4">
            <Link href="/admin" className="text-white hover:text-yellow-200 transition-colors">
              Administración
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
