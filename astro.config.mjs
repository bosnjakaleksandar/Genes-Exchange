// @ts-check
import { defineConfig } from 'astro/config';
// @ts-ignore
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://menjacnicagenes.rs',
  trailingSlash: 'never',
  output: 'server',
  adapter: netlify({
    edgeMiddleware: true,
  }),
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
        onwarn(warning, warn) {
          if (
            warning.message.includes(
              'are imported from external module "@astrojs/internal-helpers/remote"'
            ) ||
            warning.message.includes('Generated an empty chunk: "layout')
          ) {
            return;
          }
          warn(warning);
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
  },
  experimental: {
    clientPrerender: true,
  },
});
