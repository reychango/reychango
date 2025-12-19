// Script para completar el archivo .env.local con variables faltantes
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

try {
  if (!fs.existsSync(envPath)) {
    console.log('❌ El archivo .env.local no existe. Ejecuta: npm run setup-env');
    process.exit(1);
  }

  // Leer el contenido actual
  let content = fs.readFileSync(envPath, 'utf8');
  
  // Variables que deben estar presentes
  const requiredVars = {
    'IMGBB_API_KEY': '96c8ea0e1e8b9c022b4dcbf65d002d15',
    'SITE_NAME': 'Los desvaríos de Reychango'
  };

  let updated = false;
  let additions = [];

  // Verificar y agregar variables faltantes
  Object.keys(requiredVars).forEach(varName => {
    const regex = new RegExp(`^${varName}=`, 'm');
    if (!regex.test(content)) {
      additions.push(`${varName}=${requiredVars[varName]}`);
      updated = true;
    }
  });

  if (updated) {
    // Agregar las variables faltantes al final del archivo
    if (!content.endsWith('\n')) {
      content += '\n';
    }
    content += '\n# Additional Configuration\n';
    additions.forEach(add => {
      content += add + '\n';
    });

    fs.writeFileSync(envPath, content, 'utf8');
    console.log('✅ Archivo .env.local actualizado con las variables faltantes:');
    additions.forEach(add => console.log(`   - ${add}`));
  } else {
    console.log('✅ El archivo .env.local ya tiene todas las variables necesarias.');
  }

} catch (error) {
  console.error('❌ Error al actualizar el archivo .env.local:', error.message);
  process.exit(1);
}

