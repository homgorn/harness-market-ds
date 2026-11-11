// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Static build.
 *
 * Cloudflare caps a Worker version at 20,000 static asset files (Free) and
 * 100,000 (Paid) — measured 2026-11-11, API error 10304. The catalog holds
 * ~10,600 artifacts, so a full 7-locale build is ~74,000 pages: that fits a
 * Paid plan but not a Free one. The build is therefore locale-parameterised
 * (BUILD_LOCALES=en,ru) so a Free plan can ship one locale at a time, and a
 * Paid plan ships all seven from one deployment on one hostname.
 *
 * Pagefind is deliberately not used: it emits roughly one index fragment per
 * page, which for this corpus would be ~72,000 files on its own — over the
 * limit before a single HTML page ships. Search uses a compact client-side
 * index instead (scripts/build-listing-index.mjs).
 */
const locales = (process.env.BUILD_LOCALES || 'en').split(',').map((s) => s.trim()).filter(Boolean);

export default defineConfig({
  site: process.env.SITE_URL || 'https://harness-market-ds.refertur.net',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/search'),
      changefreq: 'weekly',
    }),
  ],
  vite: {
    define: {
      'import.meta.env.BUILD_LOCALES': JSON.stringify(locales.join(',')),
    },
  },
});
