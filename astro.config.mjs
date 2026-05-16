// @ts-check
import { defineConfig } from 'astro/config';
// @ts-ignore
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

const site = 'https://menjacnicagenes.rs';

/** @type {Record<string, { sr: string; en: string }>} */
const localizedRoutes = {
  '/': { sr: '/', en: '/en' },
  '/en': { sr: '/', en: '/en' },
  '/kursna-lista': { sr: '/kursna-lista', en: '/en/exchange-rates' },
  '/en/exchange-rates': { sr: '/kursna-lista', en: '/en/exchange-rates' },
  '/cesta-pitanja': { sr: '/cesta-pitanja', en: '/en/faq' },
  '/en/faq': { sr: '/cesta-pitanja', en: '/en/faq' },
};

/** @param {string} path */
const stripTrailingSlash = (path) =>
  path !== '/' && path.endsWith('/') ? path.slice(0, -1) : path;

/** @param {string} path */
const toAbsoluteUrl = (path) => new URL(path, site).href;

/** @param {string} url */
const getLocalizedLinks = (url) => {
  const path = stripTrailingSlash(new URL(url).pathname);
  const localizedRoute = localizedRoutes[path];

  if (!localizedRoute) return undefined;

  return [
    { lang: 'sr-RS', url: toAbsoluteUrl(localizedRoute.sr) },
    { lang: 'en-US', url: toAbsoluteUrl(localizedRoute.en) },
    { lang: 'x-default', url: toAbsoluteUrl(localizedRoute.sr) },
  ];
};

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'never',
  output: 'server',
  redirects: {
    '/exchange-rates': '/en/exchange-rates',
    '/faq': '/en/faq',
  },
  adapter: netlify({
    edgeMiddleware: true,
  }),
  integrations: [
    sitemap({
      changefreq: 'daily',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        return {
          ...item,
          links: getLocalizedLinks(item.url),
        };
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
