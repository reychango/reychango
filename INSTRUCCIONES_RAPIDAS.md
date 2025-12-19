# ⚡ Instrucciones Rápidas - Probar el Proyecto

## 🚀 El servidor está iniciándose...

El servidor de desarrollo de Next.js se está iniciando. En unos segundos estará listo.

---

## 🌐 Acceso Rápido

### 1. Abre tu navegador y ve a:
```
http://localhost:3000
```

### 2. Para el panel de administración:
```
http://localhost:3000/admin
```

---

## ⚠️ IMPORTANTE: Configurar Firebase Authentication

**Antes de poder usar el panel de administración**, necesitas:

1. **Ir a Firebase Console:**
   - https://console.firebase.google.com/
   - Selecciona el proyecto: **web-reychango**

2. **Habilitar Authentication:**
   - Ve a **Authentication** > **Get started**
   - Pestaña **Sign-in method**
   - Habilita **Email/Password**
   - Guarda

3. **Crear usuario administrador:**
   - Pestaña **Users** > **Add user**
   - Email: `admin@reychango.com` (o el que prefieras)
   - Password: `Admin123!` (o una contraseña segura)
   - **Guarda estas credenciales**

4. **Iniciar sesión:**
   - Ve a http://localhost:3000/admin
   - Usa las credenciales que creaste

---

## ✅ Qué Probar

### Página Principal
- ✅ Debe cargar sin errores
- ✅ Ver posts (si hay en Firestore)
- ✅ Ver galería de fotos

### Panel de Administración
- ✅ Login con Firebase Auth
- ✅ Búsqueda en tiempo real
- ✅ Crear nuevo post
- ✅ Crear nueva foto
- ✅ Mensajes de éxito/error (toasts)

---

## 🐛 Si algo no funciona

1. **Revisa la terminal** donde corre `npm run dev`
2. **Revisa la consola del navegador** (F12)
3. **Verifica `.env.local`** existe y tiene todas las variables
4. **Reinicia el servidor:** `Ctrl+C` y luego `npm run dev`

---

## 📝 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Verificar variables de entorno
npm run complete-env

# Crear .env.local desde cero
npm run setup-env
```

---

**¡El proyecto está listo para probar!** 🎉

