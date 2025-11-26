// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://menjacnicagenes.rs',
  output: 'static',
  adapter: netlify(),
  integrations: [
    sitemap({
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'sr',
        locales: {
          sr: 'sr-RS',
          en: 'en-US',
        },
      },
    }),
    partytown(),
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['chart.js'],
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
        format: {
          comments: false,
        },
      },
      cssCodeSplit: true,
      assetsInlineLimit: 0,
    },
    ssr: {
      noExternal: ['chart.js'],
      external: ['chart.js'],
    },
  },
  experimental: {
    clientPrerender: true,
  },
});
