#!/usr/bin/env node
/**
 * Split the built site into one directory per locale.
 *
 * Cloudflare Workers allows 20,000 static asset files per Worker version
 * (measured 2026-11-11: API error 10304, "Workers Free limit of 20,000
 * static asset files per Worker version"). The full corpus is ~10,600
 * artifacts × 7 locales ≈ 74,000 detail pages, so a single deployment cannot
 * hold it. Each locale is therefore its own deployment, served from the same
 * hostname under a path prefix, which keeps hreflang on one domain (Google's
 * preferred setup) instead of scattering it over subdomains.
 *
 * Output: dist-locales/<locale>/  — each self-contained and deployable.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'dist-locales');
const LOCALES = ['en', 'ru', 'zh', 'es', 'de', 'fr', 'ja'];

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found — run the build first');
  process.exit(1);
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// Shared assets that every locale deployment needs.
const SHARED = ['_astro', 'favicon.ico', 'favicon-16.png', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'og-default.png', 'manifest.webmanifest', 'robots.txt', 'llms.txt'];

const report = [];

for (const locale of LOCALES) {
  const dest = path.join(OUT, locale);
  fs.mkdirSync(dest, { recursive: true });

  // shared assets
  for (const f of SHARED) {
    const s = path.join(DIST, f);
    if (fs.existsSync(s)) {
      const target = path.join(dest, f);
      if (fs.statSync(s).isDirectory()) copyDir(s, target);
      else fs.copyFileSync(s, target);
    }
  }

  // locale-specific pages: en lives at the root, others under /<locale>
  if (locale === 'en') {
    for (const entry of fs.readdirSync(DIST, { withFileTypes: true })) {
      if (entry.name === '.DS_Store') continue;
      if (SHARED.includes(entry.name)) continue;
      const s = path.join(DIST, entry.name);
      const d = path.join(dest, entry.name);
      if (entry.isDirectory()) copyDir(s, d);
      else fs.copyFileSync(s, d);
    }
  } else {
    const s = path.join(DIST, locale);
    if (fs.existsSync(s)) copyDir(s, path.join(dest, locale));
  }

  // count files
  let count = 0;
  let bytes = 0;
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else {
        count++;
        bytes += fs.statSync(p).size;
      }
    }
  })(dest);

  report.push({ locale, files: count, mb: +(bytes / 1048576).toFixed(1), ok: count <= 20000 });
}

console.table(report);
const over = report.filter((r) => !r.ok);
if (over.length) {
  console.error('OVER LIMIT:', over.map((r) => `${r.locale}=${r.files}`).join(', '));
  process.exit(1);
}
console.log('all locale bundles under the 20,000 file limit');
