# 🎵 Las Mañanitas - El Debate Definitivo

Un sitio web moderno e interactivo que aborda el problema cultural de las diferentes versiones de "Las Mañanitas" a través de encuestas en tiempo real, estadísticas, y contenido divertido.

## 🚀 Características

- **Encuesta Interactiva**: Vota por tu versión favorita de Las Mañanitas
- **Estadísticas en Tiempo Real**: Visualiza los resultados actualizados automáticamente
- **Galería de Videos**: Enlaces a versiones populares en YouTube
- **Rankings**: Descubre cuál es la versión más popular y más controversial
- **Diseño Moderno**: Interfaz atractiva con gradientes, glassmorphism y animaciones suaves

## 🛠️ Tecnologías

- **[Astro](https://astro.build)** - Framework web moderno y optimizado
- **[React](https://react.dev)** - Para componentes interactivos (Astro Islands)
- **[TailwindCSS](https://tailwindcss.com)** - Estilos utility-first
- **[Firebase Firestore](https://firebase.google.com/docs/firestore)** - Base de datos en tiempo real (capa gratuita)
- **TypeScript** - Tipado estático para mayor seguridad

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o pnpm
- Una cuenta de Firebase (gratuita)

## 🔧 Configuración

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita Firestore Database
4. Copia las credenciales de configuración
5. Edita `src/lib/firebase.ts` y reemplaza los valores de `firebaseConfig`:

```typescript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### 3. Configurar Firestore

En Firebase Console, crea las siguientes colecciones:

- `votes` - Se llenará automáticamente con los votos
- `statistics` - Crea un documento con ID `global` y la siguiente estructura:

```json
{
  "totalVotes": 0,
  "versionCounts": {
    "hoy-por-ser-tu-cumpleaños": 0,
    "hoy-por-ser-dia-de-tu-santo": 0,
    "otras-variaciones": 0
  },
  "lastUpdated": null
}
```

- `signatures` - Se llenará automáticamente con las firmas de la petición.

### 4. Configurar Reglas de Seguridad de Firestore

En Firebase Console > Firestore Database > Rules, usa estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to statistics
    match /statistics/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    
    // Allow write to votes
    match /votes/{document=**} {
      allow read: if false;
      allow create: if true;
    }

    // Allow read/write to signatures
    match /signatures/{document=**} {
      allow read: if true;
      allow create: if true;
    }
  }
}
```

### 5. Variables de Entorno (Vercel)

Para despliegues en producción, se recomienda usar variables de entorno. En Astro, estas deben empezar con `PUBLIC_`:

- `PUBLIC_FIREBASE_API_KEY`
- `PUBLIC_FIREBASE_AUTH_DOMAIN`
- `PUBLIC_FIREBASE_PROJECT_ID`
- `PUBLIC_FIREBASE_STORAGE_BUCKET`
- `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `PUBLIC_FIREBASE_APP_ID`

## 🚀 Desarrollo

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:4321](http://localhost:4321) en tu navegador.

## 📦 Producción

Para construir el sitio para producción:

```bash
npm run build
```

Para previsualizar la build de producción:

```bash
npm run preview
```

## 🏗️ Estructura del Proyecto

```
las-mananitas/
├── src/
│   ├── components/
│   │   ├── Hero.astro          # Sección hero estática
│   │   ├── Survey.tsx          # Encuesta interactiva (React)
│   │   ├── Statistics.tsx      # Estadísticas en tiempo real (React)
│   │   ├── TopVersions.astro   # Rankings estáticos
│   │   └── VideoGallery.astro  # Galería de videos
│   ├── layouts/
│   │   └── Layout.astro        # Layout base
│   ├── lib/
│   │   └── firebase.ts         # Configuración y utilidades de Firebase
│   ├── pages/
│   │   └── index.astro         # Página principal
│   └── styles/
│       └── global.css          # Estilos globales y personalizados
├── astro.config.mjs            # Configuración de Astro
├── tailwind.config.mjs         # Configuración de TailwindCSS
└── package.json
```

## 🎨 Personalización

### Colores y Estilos

Los colores principales se definen usando las utilidades de TailwindCSS. Puedes modificarlos en `tailwind.config.mjs` o directamente en los componentes.

### Versiones de Las Mañanitas

Para agregar o modificar versiones, edita los arrays en:
- `src/components/Survey.tsx` - opciones de votación
- `src/lib/firebase.ts` - tipos de TypeScript

## 📱 Despliegue

Este proyecto puede desplegarse en:

- **[Vercel](https://vercel.com)** (recomendado)
- **[Netlify](https://netlify.com)**
- **[Cloudflare Pages](https://pages.cloudflare.com)**

Todos ofrecen capa gratuita y soporte nativo para Astro.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el sitio:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🎉 Créditos

Hecho con 💜 para resolver el debate más importante de México.

---

**¿Preguntas o problemas?** Abre un issue en GitHub.
# las-mananitas
