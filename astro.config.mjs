import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static output, deployed to GitHub Pages on the custom domain emote4d.com.
// The custom domain serves from the site root, so no `base` path is needed.
export default defineConfig({
  site: 'https://emote4d.com',
  vite: {
    plugins: [tailwindcss()],
  },
});
