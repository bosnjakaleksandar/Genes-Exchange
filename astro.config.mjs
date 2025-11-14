// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import AstroPurgeCSS from 'astro-purgecss';
import compressor from 'astro-compressor';

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
    // PurgeCSS - uklanja nekorišćeni CSS
    AstroPurgeCSS({
      content: [
        './src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}',
      ],
      safelist: {
        standard: [/^chart-/, /^swiper-/], // Zadrži klase za chart.js i druge dinamičke biblioteke
        deep: [/^astro-/],
        greedy: [/^data-/, /^aria-/],
      },
      // Ekstremno čišćenje (opcionalno, može biti agresivno)
      // rejected: true,
      // rejectedCss: true,
    }),
    // Compressor - kompresuje HTML, CSS, JS, SVG
    compressor({
      gzip: true,
      brotli: true,
    }),
  ],
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['chart.js'],
          },
          // Optimizovani asset file names
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name ? assetInfo.name.split('.') : [];
            const ext = info.length > 0 ? info[info.length - 1] : '';
            if (assetInfo.name && /\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(assetInfo.name)) {
              return `assets/images/[name]-[hash][extname]`;
            } else if (assetInfo.name && /\.css$/i.test(assetInfo.name)) {
              return `assets/css/[name]-[hash][extname]`;
            } else if (assetInfo.name && /\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug'],
        },
        format: {
          comments: false,
        },
      },
      cssCodeSplit: true, // Promeni na true za bolji lazy loading
      assetsInlineLimit: 4096,
      // Dodatne optimizacije
      cssMinify: true,
      reportCompressedSize: false, // Ubrzava build
    },
    ssr: {
      noExternal: ['chart.js'],
    },
  },
  experimental: {
    clientPrerender: true,
  },
});