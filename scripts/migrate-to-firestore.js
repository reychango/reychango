// Script para migrar datos de archivos JSON locales a Firestore
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDO_-wo3nN8FxoCAwcKi_t6CpYysAFhe5Y",
  authDomain: "web-reychango.firebaseapp.com",
  projectId: "web-reychango",
  storageBucket: "web-reychango.firebasestorage.app",
  messagingSenderId: "357290300866",
  appId: "1:357290300866:web:27dfd95b00ebe34ea8f25b"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para leer un archivo JSON
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error al leer el archivo ${filePath}:`, error);
    return [];
  }
}

// Función para migrar posts
async function migratePosts() {
  console.log('Migrando posts...');
  
  // Leer posts del archivo JSON
  const postsPath = path.join(process.cwd(), 'data', 'posts.json');
  const posts = readJsonFile(postsPath);
  
  if (!posts.length) {
    console.log('No hay posts para migrar.');
    return;
  }
  
  // Verificar si ya hay posts en Firestore para evitar duplicados
  const postsRef = collection(db, 'posts');
  const snapshot = await getDocs(query(postsRef));
  
  if (!snapshot.empty) {
    console.log('Ya existen posts en Firestore. Saltando migración de posts.');
    return;
  }
  
  // Migrar cada post a Firestore
  let successCount = 0;
  for (const post of posts) {
    try {
      await addDoc(collection(db, 'posts'), {
        ...post,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      successCount++;
    } catch (error) {
      console.error(`Error al migrar post "${post.title}":`, error);
    }
  }
  
  console.log(`Migración de posts completada. ${successCount}/${posts.length} posts migrados.`);
}

// Función para migrar fotos
async function migratePhotos() {
  console.log('Migrando fotos...');
  
  // Leer fotos del archivo JSON
  const photosPath = path.join(process.cwd(), 'data', 'photos.json');
  const photos = readJsonFile(photosPath);
  
  if (!photos.length) {
    console.log('No hay fotos para migrar.');
    return;
  }
  
  // Verificar si ya hay fotos en Firestore para evitar duplicados
  const photosRef = collection(db, 'photos');
  const snapshot = await getDocs(query(photosRef));
  
  if (!snapshot.empty) {
    console.log('Ya existen fotos en Firestore. Saltando migración de fotos.');
    return;
  }
  
  // Migrar cada foto a Firestore
  let successCount = 0;
  for (const photo of photos) {
    try {
      await addDoc(collection(db, 'photos'), {
        ...photo,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      successCount++;
    } catch (error) {
      console.error(`Error al migrar foto "${photo.title}":`, error);
    }
  }
  
  console.log(`Migración de fotos completada. ${successCount}/${photos.length} fotos migradas.`);
}

// Función principal para ejecutar la migración
async function migrateData() {
  try {
    console.log('Iniciando migración de datos a Firestore...');
    
    // Migrar posts
    await migratePosts();
    
    // Migrar fotos
    await migratePhotos();
    
    console.log('Migración completada con éxito.');
  } catch (error) {
    console.error('Error durante la migración:', error);
  }
}

// Ejecutar la migración
migrateData();
