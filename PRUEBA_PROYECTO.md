# 🧪 Guía para Probar el Proyecto

## ✅ Estado del Proyecto

El servidor de desarrollo está iniciándose. Sigue estos pasos para probar todas las funcionalidades.

---

## 🌐 Acceso al Proyecto

### Página Principal
- **URL:** http://localhost:3000
- **Descripción:** Página principal del blog con posts recientes y galería

### Panel de Administración
- **URL:** http://localhost:3000/admin
- **Descripción:** Panel para gestionar contenido (requiere autenticación)

### Otras Páginas
- **Blog:** http://localhost:3000/blog
- **Fotos:** http://localhost:3000/fotos

---

## 🔐 Configuración de Firebase Authentication (IMPORTANTE)

Para poder usar el panel de administración, necesitas configurar Firebase Authentication:

### Paso 1: Ir a Firebase Console
1. Ve a: https://console.firebase.google.com/
2. Inicia sesión con tu cuenta de Google
3. Selecciona el proyecto: **web-reychango**

### Paso 2: Habilitar Authentication
1. En el menú lateral, haz clic en **Authentication**
2. Si es la primera vez, haz clic en **Get started**
3. Ve a la pestaña **Sign-in method**
4. Haz clic en **Email/Password**
5. Habilita el primer toggle (Email/Password)
6. Haz clic en **Save**

### Paso 3: Crear Usuario Administrador
1. Ve a la pestaña **Users**
2. Haz clic en **Add user**
3. Ingresa:
   - **Email:** admin@reychango.com (o el que prefieras)
   - **Password:** Una contraseña segura (ej: Admin123!)
4. Haz clic en **Add user**
5. **Guarda estas credenciales** - las necesitarás para iniciar sesión

---

## 🧪 Pruebas a Realizar

### 1. ✅ Página Principal
- [ ] Abre http://localhost:3000
- [ ] Verifica que se carga correctamente
- [ ] Verifica que hay posts (si existen en Firestore)
- [ ] Verifica que la galería de fotos se muestra
- [ ] Prueba el modo oscuro (si hay toggle)

### 2. ✅ Panel de Administración - Login
- [ ] Abre http://localhost:3000/admin
- [ ] Verifica que aparece el formulario de login mejorado
- [ ] Intenta iniciar sesión con credenciales incorrectas
- [ ] Verifica que aparece un mensaje de error claro
- [ ] Inicia sesión con las credenciales de Firebase que creaste
- [ ] Verifica que te redirige al panel de administración

### 3. ✅ Panel de Administración - Funcionalidades
- [ ] Verifica que ves tu email en la parte superior
- [ ] Prueba la búsqueda de posts (escribe en el campo de búsqueda)
- [ ] Prueba cambiar entre pestañas (Posts / Fotos)
- [ ] Prueba la búsqueda de fotos
- [ ] Haz clic en "Nuevo Post" y verifica que abre el editor
- [ ] Haz clic en "Nueva Foto" y verifica que abre el editor

### 4. ✅ Editor de Posts
- [ ] Crea un nuevo post con:
  - Título: "Mi primer post de prueba"
  - Slug: "mi-primer-post-prueba"
  - Contenido: "Este es un post de prueba"
- [ ] Verifica que puedes guardar el post
- [ ] Verifica que aparece un mensaje de éxito (toast)
- [ ] Verifica que te redirige al panel después de guardar

### 5. ✅ Editor de Fotos
- [ ] Crea una nueva foto con:
  - Título: "Foto de prueba"
  - URL: Puedes usar una URL de imagen pública (ej: https://picsum.photos/400/400)
- [ ] Verifica que puedes guardar la foto
- [ ] Verifica que aparece un mensaje de éxito

### 6. ✅ Búsqueda y Filtrado
- [ ] En el panel de admin, usa la barra de búsqueda
- [ ] Busca por título de post
- [ ] Busca por slug
- [ ] Verifica que los resultados se filtran en tiempo real

### 7. ✅ Manejo de Errores
- [ ] Intenta acceder a una página que no existe (ej: /ruta-inexistente)
- [ ] Verifica que aparece una página de error amigable
- [ ] Intenta guardar un post sin completar campos requeridos
- [ ] Verifica que aparece un mensaje de error claro

---

## 🐛 Solución de Problemas Comunes

### Error: "Faltan variables de entorno de Firebase"
**Solución:** Verifica que `.env.local` existe y tiene todas las variables:
```bash
npm run complete-env
```

### Error: "Firebase: Error (auth/user-not-found)"
**Solución:** Asegúrate de haber creado el usuario en Firebase Authentication

### Error: "Network request failed" en login
**Solución:** 
- Verifica tu conexión a internet
- Verifica que Firebase Authentication está habilitado
- Verifica que las credenciales en `.env.local` son correctas

### El servidor no inicia
**Solución:**
```bash
# Limpia la caché y reinstala
rm -rf .next node_modules
npm install
npm run dev
```

### Error de puerto ocupado
**Solución:** Si el puerto 3000 está ocupado:
```bash
# Usa otro puerto
PORT=3001 npm run dev
```

---

## 📊 Checklist de Funcionalidades

### Seguridad
- [x] Variables de entorno configuradas
- [x] Firebase Authentication implementado
- [x] API routes protegidas
- [x] Tokens JWT para sesiones

### UX/UI
- [x] Error boundaries implementados
- [x] Loading states consistentes
- [x] Sistema de toasts
- [x] Búsqueda en tiempo real
- [x] Validación mejorada

### Performance
- [x] Lazy loading de imágenes
- [x] Debounce en búsquedas
- [x] Componentes optimizados

---

## 🎯 Próximos Pasos Después de Probar

1. **Personalizar contenido:**
   - Agrega tus propios posts
   - Sube tus propias fotos
   - Organiza en álbumes

2. **Configurar para producción:**
   - Crea tu propio proyecto Firebase
   - Actualiza las credenciales en `.env.local`
   - Configura dominio personalizado

3. **Desplegar:**
   - Vercel: `vercel deploy`
   - Netlify: Conecta tu repositorio
   - Otra plataforma de tu elección

---

## 📝 Notas

- El servidor se recarga automáticamente cuando cambias archivos
- Los cambios se reflejan inmediatamente en el navegador
- Revisa la consola del navegador (F12) para ver logs y errores
- Revisa la terminal donde corre el servidor para errores del servidor

---

**¡Disfruta probando tu blog mejorado!** 🎉

