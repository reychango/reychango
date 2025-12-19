# 🐛 Debug de Imágenes

## Problema Reportado
Algunas imágenes se ven y otras no.

## Posibles Causas

### 1. URLs Vacías o Inválidas
- Algunos posts pueden tener `coverImage` vacío o `null`
- URLs mal formadas

### 2. Dominios No Permitidos
- Next.js Image requiere que los dominios externos estén en `next.config.js`
- Verificar que todos los dominios de imágenes estén listados

### 3. Problemas con OptimizedImage
- El componente puede estar fallando silenciosamente
- El manejo de errores puede no estar funcionando correctamente

## Soluciones Implementadas

### ✅ Mejoras en OptimizedImage
1. Validación mejorada de src
2. Fallback automático a imagen por defecto
3. Mejor manejo de errores
4. Fondo de color mientras carga

### ✅ Simplificación del Código
- Eliminado condicionales innecesarios
- Siempre usar `post.coverImage || '/img/default-post.jpg'`
- Fondo gris visible mientras carga

## 🔍 Cómo Debuggear

### 1. Revisar Consola del Navegador
Abre la consola (F12) y busca:
- Errores de carga de imágenes
- Warnings sobre URLs inválidas
- Errores de CORS

### 2. Verificar URLs de Imágenes
En la consola del navegador, ejecuta:
```javascript
// Ver qué URLs tienen los posts
document.querySelectorAll('img').forEach(img => {
  console.log('Src:', img.src, 'Alt:', img.alt);
});
```

### 3. Verificar Dominios Permitidos
Revisa `next.config.js` y asegúrate de que todos los dominios de imágenes estén listados:
```javascript
images: {
  domains: ['i.ibb.co', 'picsum.photos', 'images.unsplash.com', 'via.placeholder.com'],
  // Agregar más dominios si es necesario
}
```

### 4. Verificar Datos en Firestore
- Algunos posts pueden no tener `coverImage`
- Algunos pueden tener URLs incorrectas

## 🛠️ Solución Temporal

Si necesitas una solución inmediata, puedes usar `Image` directamente:

```jsx
import Image from 'next/image';

<Image
  src={post.coverImage || '/img/default-post.jpg'}
  alt={post.title}
  fill
  className="object-cover"
  unoptimized
/>
```

## 📝 Checklist de Verificación

- [ ] ¿Las imágenes locales (`/img/...`) se ven?
- [ ] ¿Las imágenes externas (imgBB, etc.) se ven?
- [ ] ¿Hay errores en la consola del navegador?
- [ ] ¿Los dominios están en `next.config.js`?
- [ ] ¿Los posts tienen `coverImage` válido en Firestore?

---

**El componente está mejorado. Recarga la página y verifica si las imágenes se ven ahora.**

