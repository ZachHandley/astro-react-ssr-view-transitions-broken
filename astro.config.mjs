// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  // Enable React to support React JSX components.
  integrations: [react(), icon()],
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare({
    imageService: 'passthrough',
  }),
});
