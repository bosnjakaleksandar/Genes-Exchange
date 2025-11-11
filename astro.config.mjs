// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://menjacnicagenes.rs',
  output: 'server',
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
      },
      cssCodeSplit: false,
      assetsInlineLimit: 4096,
    },
    ssr: {
      noExternal: ['chart.js'],
    },
  },
  experimental: {
    clientPrerender: true,
  },
});
