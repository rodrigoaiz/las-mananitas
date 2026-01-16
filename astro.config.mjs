// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://las-mananitas.vercel.app',
  trailingSlash: 'always',
  
  redirects: {
    '/queremos-pastel/las-mananitas-letra-completa-pdf': '/letra',
    '/queremos-pastel/las-mananitas-para-ninos': '/letra'
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
