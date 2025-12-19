// Script para crear el archivo .env.local automáticamente
const fs = require('fs');
const path = require('path');

const envContent = `# Firebase Configuration
# Estas son las credenciales que estaban originalmente en el código
# Para producción, deberías crear tu propio proyecto Firebase y usar tus propias credenciales
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDO_-wo3nN8FxoCAwcKi_t6CpYysAFhe5Y
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=web-reychango.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=web-reychango
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=web-reychango.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=357290300866
NEXT_PUBLIC_FIREBASE_APP_ID=1:357290300866:web:27dfd95b00ebe34ea8f25b

# ImgBB API Key (para subir imágenes en el editor)
IMGBB_API_KEY=96c8ea0e1e8b9c022b4dcbf65d002d15

# Site Configuration
SITE_NAME=Los desvaríos de Reychango
`;

const envPath = path.join(__dirname, '..', '.env.local');

try {
  // Verificar si el archivo ya existe
  if (fs.existsSync(envPath)) {
    console.log('⚠️  El archivo .env.local ya existe.');
    console.log('📝 Si quieres recrearlo, elimínalo primero y vuelve a ejecutar este script.');
    process.exit(0);
  }

  // Crear el archivo
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Archivo .env.local creado exitosamente!');
  console.log('📁 Ubicación:', envPath);
  console.log('');
  console.log('📝 IMPORTANTE:');
  console.log('   - Este archivo contiene credenciales de Firebase');
  console.log('   - Para producción, crea tu propio proyecto Firebase');
  console.log('   - El archivo .env.local está en .gitignore y no se subirá al repositorio');
  console.log('');
  console.log('🚀 Próximos pasos:');
  console.log('   1. Configura Firebase Authentication en Firebase Console');
  console.log('   2. Crea un usuario administrador');
  console.log('   3. Ejecuta: npm run dev');
} catch (error) {
  console.error('❌ Error al crear el archivo .env.local:', error.message);
  process.exit(1);
}

