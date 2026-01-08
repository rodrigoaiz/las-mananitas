// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://las-mananitas.vercel.app',
  
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [react(), sitemap()]
});
