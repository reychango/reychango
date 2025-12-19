# 🚀 Guía para Previsualizar el Proyecto

Esta guía te ayudará a ejecutar el proyecto localmente y ver todas las mejoras implementadas.

## 📋 Requisitos Previos

- Node.js 14.x o superior instalado
- npm o yarn instalado
- Una cuenta de Firebase (gratuita)
- Una cuenta de imgBB (opcional, para subir imágenes)

---

## 🔧 Paso 1: Configurar Variables de Entorno

### 1.1 Crear archivo `.env.local`

En la raíz del proyecto, crea un archivo llamado `.env.local` con el siguiente contenido:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# ImgBB API Key (opcional, para subir imágenes)
IMGBB_API_KEY=tu_imgbb_api_key_aqui

# Site Configuration
SITE_NAME=Los desvaríos de Reychango
```

### 1.2 Obtener Credenciales de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **Configuración del proyecto** (⚙️) > **Tus aplicaciones**
4. Si no tienes una app web, haz clic en **Agregar app** > **Web** (`</>`)
5. Copia las credenciales y pégalas en tu `.env.local`

### 1.3 Configurar Firebase Authentication

1. En Firebase Console, ve a **Authentication** > **Get started**
2. Habilita el proveedor **Email/Password**
3. Ve a la pestaña **Users** y crea un usuario administrador:
   - Email: `admin@tudominio.com` (o el que prefieras)
   - Contraseña: una contraseña segura

**⚠️ IMPORTANTE:** Guarda estas credenciales, las necesitarás para iniciar sesión en el panel de administración.

---

## 📦 Paso 2: Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias.

---

## 🏃 Paso 3: Ejecutar el Servidor de Desarrollo

Ejecuta el siguiente comando:

```bash
npm run dev
```

Deberías ver algo como:

```
> reychango-blog@0.1.0 dev
> next dev

   ▲ Next.js 14.0.0
   - Local:        http://localhost:3000
   - Ready in 2.3s
```

---

## 🌐 Paso 4: Abrir en el Navegador

1. Abre tu navegador web
2. Ve a: **http://localhost:3000**

Deberías ver la página principal del blog.

---

## 🔐 Paso 5: Probar el Panel de Administración

### 5.1 Acceder al Panel

1. Ve a: **http://localhost:3000/admin**
2. Deberías ver el formulario de login mejorado

### 5.2 Iniciar Sesión

1. Ingresa el **email** que creaste en Firebase Authentication
2. Ingresa la **contraseña** que configuraste
3. Haz clic en **Iniciar sesión**

**✅ Si todo está bien configurado:**
- Serás redirigido al panel de administración
- Verás tu email en la parte superior
- Podrás gestionar posts, fotos y álbumes

**❌ Si hay errores:**
- Verifica que las variables de entorno estén correctas
- Asegúrate de que Firebase Authentication esté habilitado
- Revisa la consola del navegador (F12) para ver errores específicos

---

## 🧪 Paso 6: Probar las Mejoras Implementadas

### 6.1 Probar Manejo de Errores

1. Intenta iniciar sesión con credenciales incorrectas
2. Deberías ver un mensaje de error claro y amigable
3. Intenta acceder a una API route sin autenticación (desde la consola del navegador)

### 6.2 Probar Componentes de UI

- **Loading Spinner:** Al cargar páginas, verás spinners consistentes
- **Error Messages:** Los errores se muestran de forma clara y consistente
- **Error Boundary:** Si ocurre un error de React, verás una página de error amigable

### 6.3 Probar Autenticación

1. Inicia sesión en `/admin`
2. Abre las herramientas de desarrollador (F12) > **Application** > **Cookies**
3. **No deberías ver** una cookie `auth_token` simple
4. En su lugar, Firebase maneja la sesión de forma segura

### 6.4 Probar API Routes Protegidas

1. Con la sesión iniciada, intenta crear un nuevo post
2. Debería funcionar correctamente
3. Cierra sesión e intenta crear un post nuevamente
4. Deberías recibir un error de "No autorizado"

---

## 🐛 Solución de Problemas Comunes

### Error: "Faltan variables de entorno de Firebase"

**Solución:** Asegúrate de que el archivo `.env.local` existe y tiene todas las variables necesarias.

### Error: "Firebase: Error (auth/user-not-found)"

**Solución:** Verifica que hayas creado el usuario en Firebase Authentication.

### Error: "Network request failed" en login

**Solución:** 
- Verifica tu conexión a internet
- Asegúrate de que las credenciales de Firebase sean correctas
- Revisa que Firebase Authentication esté habilitado

### El servidor no inicia

**Solución:**
```bash
# Limpia la caché y reinstala
rm -rf .next node_modules
npm install
npm run dev
```

### Variables de entorno no se cargan

**Solución:**
- Asegúrate de que el archivo se llama exactamente `.env.local` (con el punto al inicio)
- Reinicia el servidor de desarrollo después de crear/modificar `.env.local`
- Las variables que empiezan con `NEXT_PUBLIC_` son públicas, las demás son solo del servidor

---

## 📝 Notas Importantes

1. **Modo Desarrollo:** El servidor se recarga automáticamente cuando cambias archivos
2. **Hot Reload:** Los cambios se reflejan inmediatamente en el navegador
3. **Consola del Navegador:** Presiona F12 para ver errores y logs
4. **Consola del Servidor:** Los errores del servidor aparecen en la terminal donde ejecutaste `npm run dev`

---

## 🎯 Qué Esperar Ver

### Página Principal (`/`)
- ✅ Diseño moderno con modo oscuro
- ✅ Lista de posts recientes
- ✅ Galería de fotos
- ✅ Categorías/etiquetas

### Panel de Administración (`/admin`)
- ✅ Formulario de login mejorado con Firebase Auth
- ✅ Mensajes de error claros
- ✅ Loading spinners durante la carga
- ✅ Interfaz para gestionar posts, fotos y álbumes

### Editor (`/admin/editor`)
- ✅ Editor de Markdown mejorado
- ✅ Subida de imágenes (si configuraste imgBB)
- ✅ Validación de formularios
- ✅ Mensajes de éxito/error claros

---

## 🚀 Próximos Pasos

Una vez que todo funcione:

1. **Personaliza el contenido:** Agrega tus propios posts y fotos
2. **Configura imgBB:** Para poder subir imágenes desde el editor
3. **Personaliza el diseño:** Modifica los colores y estilos en `tailwind.config.js`
4. **Despliega:** Cuando esté listo, despliega en Vercel o Netlify

---

## 📞 ¿Necesitas Ayuda?

Si encuentras problemas:

1. Revisa la consola del navegador (F12)
2. Revisa la terminal donde corre el servidor
3. Verifica que todas las variables de entorno estén correctas
4. Asegúrate de que Firebase Authentication esté configurado correctamente

---

¡Disfruta probando tu blog mejorado! 🎉

