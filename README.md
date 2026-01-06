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

### 2. Configurar Supabase

1. Ve a [Supabase Console](https://supabase.com/dashboard/)
2. Crea un nuevo proyecto
3. Copia la `URL` y la `anon key` de la configuración de API.
4. Edita `.env` (o crea uno) y añade:

```env
PUBLIC_SUPABASE_URL=TU_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY=TU_SUPABASE_ANON_KEY
```

### 3. Configurar la Base de Datos (SQL)

Ejecuta el siguiente script en el **SQL Editor** de Supabase para crear las tablas, funciones y políticas de seguridad:

```sql
-- 1. Crear tablas
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  reason TEXT NOT NULL,
  country TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE statistics (
  id TEXT PRIMARY KEY,
  total_votes BIGINT DEFAULT 0,
  version_counts JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Inicializar estadísticas
INSERT INTO statistics (id, total_votes, version_counts)
VALUES ('global', 0, '{"hoy-por-ser-tu-cumpleaños": 0, "hoy-por-ser-dia-de-tu-santo": 0, "otras-variaciones": 0}'::jsonb);

-- 3. Función para agregar votos
CREATE OR REPLACE FUNCTION aggregate_vote()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE statistics
  SET 
    total_votes = total_votes + 1,
    version_counts = jsonb_set(
      version_counts, 
      ARRAY[NEW.version], 
      ((COALESCE(version_counts->>NEW.version, '0')::int) + 1)::text::jsonb
    ),
    updated_at = NOW()
  WHERE id = 'global';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger para votos
CREATE TRIGGER on_vote_created
AFTER INSERT ON votes
FOR EACH ROW EXECUTE FUNCTION aggregate_vote();

-- 5. Seguridad (RLS)
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

-- Políticas para votes: Solo creación
CREATE POLICY "Allow anonymous insert" ON votes FOR INSERT WITH CHECK (true);

-- Políticas para signatures: Lectura y creación
CREATE POLICY "Allow anonymous read" ON signatures FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON signatures FOR INSERT WITH CHECK (true);

-- Políticas para statistics: Solo lectura
CREATE POLICY "Allow anonymous read" ON statistics FOR SELECT USING (true);
```

### 4. Variables de Entorno (Vercel)

Para despliegues en producción, añade estas variables en el panel de Vercel:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`

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
│   │   └── supabase.ts         # Configuración y utilidades de Supabase
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
- `src/lib/supabase.ts` - tipos de TypeScript y lógica

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
