#!/usr/bin/env node
/**
 * Build every locale and report the file count of each bundle against
 * Cloudflare's per-version asset cap.
 *
 * Measured (2026-11-11): 20,000 static asset files per Worker version on the
 * Free plan, 100,000 on Paid. Each locale bundle is ~15,400 files, so every
 * locale fits the Free cap and a single Paid deployment can carry all seven.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LOCALES = (process.env.LOCALES || 'en,ru,zh,es,de,fr,ja').split(',').map((s) => s.trim());
const LIMIT = Number(process.env.FILE_LIMIT || 20000);
const OUT = path.join(ROOT, 'dist-locales');

fs.rmSync(OUT, { recursive: true, force: true });

function countFiles(dir) {
  let n = 0;
  let bytes = 0;
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else {
        n++;
        bytes += fs.statSync(p).size;
      }
    }
  })(dir);
  return { n, bytes };
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

const report = [];

for (const locale of LOCALES) {
  console.log(`\n=== building ${locale} ===`);
  execFileSync('node', ['scripts/write-locales-config.mjs'], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, BUILD_LOCALES: locale },
  });
  execFileSync('npx', ['astro', 'build'], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, BUILD_LOCALES: locale },
  });

  const dist = path.join(ROOT, 'dist');
  const dest = path.join(OUT, locale);
  fs.mkdirSync(dest, { recursive: true });

  if (locale === 'en') {
    copyDir(dist, dest);
  } else {
    // locale pages live under /<locale>/ inside the shared dist
    const src = path.join(dist, locale);
    if (fs.existsSync(src)) copyDir(src, path.join(dest, locale));
  }

  const { n, bytes } = countFiles(dest);
  report.push({ locale, files: n, mb: +(bytes / 1048576).toFixed(1), ok: n <= LIMIT });
  console.log(`${locale}: ${n} files, ${(bytes / 1048576).toFixed(1)} MB`);
}

console.log('\n' + JSON.stringify(report, null, 2));
const over = report.filter((r) => !r.ok);
if (over.length) {
  console.error(`OVER LIMIT (${LIMIT}): ${over.map((r) => `${r.locale}=${r.files}`).join(', ')}`);
  process.exit(1);
}
console.log(`all locale bundles under the ${LIMIT} file limit`);
