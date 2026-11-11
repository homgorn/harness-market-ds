#!/usr/bin/env node
/**
 * Write src/locales.config.json from BUILD_LOCALES before the Astro build.
 *
 * Astro hoists getStaticPaths() out of the module scope, so it cannot read a
 * module-level const; the locale list has to arrive as an import.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const locales = (process.env.BUILD_LOCALES || 'en')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const out = path.join(ROOT, 'src', 'locales.config.json');
fs.writeFileSync(out, JSON.stringify({ locales }, null, 2) + '\n');
console.log('locales.config.json ->', locales.join(', '));
