// @ts-check
import { defineConfig } from 'astro/config';
import { getCollection } from 'astro:content';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// Generate redirects from draft articles
const articulos = await getCollection('articulos');
/** @type {Record<string, string>} */
const autoRedirects = {};
articulos.forEach(article => {
  if (article.data.draft && article.data.redirectTo) {
    autoRedirects[`/queremos-pastel/${article.slug}`] = article.data.redirectTo;
  }
});

// https://astro.build/config
export default defineConfig({
  site: 'https://las-mananitas.vercel.app',
  trailingSlash: 'always',
  
  redirects: {
    ...autoRedirects,
    // Redirects manuales adicionales si los necesitas
  },
  
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [
    react(), 
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('sitemap-index.xml'),
    })
  ]
});
