# ⚡ Inicio Rápido - Previsualizar el Proyecto

## 🎯 Pasos Rápidos (5 minutos)

### 1️⃣ Crear archivo `.env.local`

Crea un archivo llamado `.env.local` en la raíz del proyecto con este contenido:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDO_-wo3nN8FxoCAwcKi_t6CpYysAFhe5Y
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=web-reychango.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=web-reychango
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=web-reychango.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=357290300866
NEXT_PUBLIC_FIREBASE_APP_ID=1:357290300866:web:27dfd95b00ebe34ea8f25b
IMGBB_API_KEY=96c8ea0e1e8b9c022b4dcbf65d002d15
SITE_NAME=Los desvaríos de Reychango
```

**⚠️ NOTA:** Estas son las credenciales que estaban en el código. Para producción, deberías crear tu propio proyecto Firebase.

### 2️⃣ Instalar dependencias (si no lo has hecho)

```bash
npm install
```

### 3️⃣ Ejecutar el servidor

```bash
npm run dev
```

### 4️⃣ Abrir en el navegador

Ve a: **http://localhost:3000**

---

## 🔐 Para Probar el Panel de Administración

**IMPORTANTE:** Necesitas crear un usuario en Firebase Authentication primero:

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto `web-reychango`
3. Ve a **Authentication** > **Users**
4. Haz clic en **Add user**
5. Crea un usuario con email y contraseña
6. Usa esas credenciales para iniciar sesión en `/admin`

---

## ✅ Verificación Rápida

Si todo funciona correctamente, deberías ver:

- ✅ Página principal cargando en `http://localhost:3000`
- ✅ Panel de login en `http://localhost:3000/admin` (con diseño mejorado)
- ✅ Sin errores en la consola del navegador (F12)
- ✅ Sin errores en la terminal donde corre el servidor

---

## 🐛 Si algo falla

1. **Revisa la terminal** - Los errores aparecen ahí
2. **Revisa la consola del navegador** (F12) - Para errores del cliente
3. **Verifica `.env.local`** - Debe existir y tener todas las variables
4. **Reinicia el servidor** - Detén con `Ctrl+C` y vuelve a ejecutar `npm run dev`

---

¡Listo! 🎉

