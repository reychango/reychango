import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const CONFIG_COLLECTION = 'site_config';
const SOCIAL_DOC_ID = 'social_links';

// Valores por defecto para las redes sociales
export const defaultSocialLinks = {
    facebook: "",
    facebookSecondary: "",
    instagram: "",
    threads: "",
    bluesky: "",
    mastodon: "",
};

/**
 * Obtiene los enlaces de redes sociales desde Firestore
 */
export async function getSocialLinks() {
    try {
        const docRef = doc(db, CONFIG_COLLECTION, SOCIAL_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { ...defaultSocialLinks, ...docSnap.data() };
        } else {
            return defaultSocialLinks;
        }
    } catch (error) {
        console.error('Error al obtener social links:', error);
        return defaultSocialLinks;
    }
}

/**
 * Guarda los enlaces de redes sociales en Firestore
 */
export async function saveSocialLinks(links) {
    try {
        const docRef = doc(db, CONFIG_COLLECTION, SOCIAL_DOC_ID);
        await setDoc(docRef, links, { merge: true });
        return { success: true };
    } catch (error) {
        console.error('Error al guardar social links:', error);
        return { success: false, error: error.message };
    }
}

// ===== FRIEND LINKS =====

const FRIEND_LINKS_DOC_ID = 'friend_links';

// Valores por defecto para los enlaces amigos (array de objetos)
export const defaultFriendLinks = [];

/**
 * Obtiene los enlaces de webs amigas desde Firestore
 * Cada enlace tiene: { name: string, url: string }
 */
export async function getFriendLinks() {
    try {
        const docRef = doc(db, CONFIG_COLLECTION, FRIEND_LINKS_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists() && docSnap.data().links) {
            return docSnap.data().links;
        } else {
            return defaultFriendLinks;
        }
    } catch (error) {
        console.error('Error al obtener friend links:', error);
        return defaultFriendLinks;
    }
}

/**
 * Guarda los enlaces de webs amigas en Firestore
 * @param {Array} links - Array de objetos { name: string, url: string }
 */
export async function saveFriendLinks(links) {
    try {
        const docRef = doc(db, CONFIG_COLLECTION, FRIEND_LINKS_DOC_ID);
        await setDoc(docRef, { links }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error('Error al guardar friend links:', error);
        return { success: false, error: error.message };
    }
}
