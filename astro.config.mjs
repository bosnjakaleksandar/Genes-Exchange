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
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('chart.js')) {
                return 'vendor-charts';
              }
              return 'vendor';
            }
            if (id.includes('/ts/components/customSelect')) {
              return 'custom-select';
            }
            if (id.includes('/ts/components/ratesTable')) {
              return 'rates-table';
            }
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info'],
        },
        mangle: true,
      },
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 500,
    },
    ssr: {
      noExternal: ['chart.js'],
    },
  },
  experimental: {
    clientPrerender: true,
  },
});
