# 🔧 Configuración de .env.local

## ✅ El archivo .env.local ya está configurado

He creado un script que te permite generar el archivo `.env.local` automáticamente. El archivo ya existe en tu proyecto.

## 📝 Contenido del archivo .env.local

El archivo debe contener las siguientes variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDO_-wo3nN8FxoCAwcKi_t6CpYysAFhe5Y
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=web-reychango.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=web-reychango
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=web-reychango.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=357290300866
NEXT_PUBLIC_FIREBASE_APP_ID=1:357290300866:web:27dfd95b00ebe34ea8f25b

# ImgBB API Key
IMGBB_API_KEY=96c8ea0e1e8b9c022b4dcbf65d002d15

# Site Configuration
SITE_NAME=Los desvaríos de Reychango
```

## 🛠️ Si necesitas recrear el archivo

Si por alguna razón necesitas recrear el archivo `.env.local`, puedes:

### Opción 1: Usar el script automático
```bash
npm run setup-env
```

### Opción 2: Crearlo manualmente

1. Crea un archivo llamado `.env.local` en la raíz del proyecto
2. Copia y pega el contenido de arriba
3. Guarda el archivo

## ⚠️ Importante

- El archivo `.env.local` está en `.gitignore` y **NO se subirá al repositorio** (esto es correcto por seguridad)
- Estas credenciales son del proyecto Firebase existente
- Para producción, deberías crear tu propio proyecto Firebase

## 🔐 Configurar Firebase Authentication

Para poder usar el panel de administración, necesitas:

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Seleccionar el proyecto `web-reychango`
3. Ir a **Authentication** > **Get started**
4. Habilitar el proveedor **Email/Password**
5. Crear un usuario administrador:
   - Ve a **Users** > **Add user**
   - Ingresa un email y contraseña
   - Guarda estas credenciales para iniciar sesión

## ✅ Verificar que todo funciona

1. Asegúrate de que `.env.local` existe y tiene todas las variables
2. Ejecuta: `npm run dev`
3. Ve a: `http://localhost:3000/admin`
4. Inicia sesión con las credenciales de Firebase que creaste

## 🐛 Si hay problemas

- **Error de variables de entorno:** Verifica que `.env.local` existe y tiene todas las variables
- **Error de Firebase:** Asegúrate de que las credenciales son correctas
- **Error de autenticación:** Verifica que Firebase Authentication está habilitado y que creaste un usuario

---

**¡Listo!** Tu archivo `.env.local` está configurado. 🎉

