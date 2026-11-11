#!/usr/bin/env node
/**
 * Build the client-side search index and the per-locale listing data.
 *
 * Pagefind was removed because it emits roughly one index fragment per page —
 * for this corpus that is ~72,000 files, more than Cloudflare allows per
 * deployment on its own. A single compact JSON index replaces it: the browser
 * loads it once and filters client-side.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const PUBLIC = path.join(ROOT, 'public');

const cat = JSON.parse(fs.readFileSync(path.join(DATA, 'catalog.ssr.json'), 'utf8'));
const buckets = JSON.parse(fs.readFileSync(path.join(DATA, 'buckets.json'), 'utf8'));
const ranks = JSON.parse(fs.readFileSync(path.join(DATA, 'ranks.json'), 'utf8'));

fs.mkdirSync(PUBLIC, { recursive: true });

/* ---------- search index: name, description, tags, kind, popularity ---------- */

const index = cat.items.map((i) => ({
  s: i.s,
  n: i.n,
  k: i.k,
  c: i.c,
  d: (i.de || '').slice(0, 200),
  t: i.tg || [],
  p: ranks.popular[i.s],
  s2: i.st,
  d2: i.dl,
  r: i.rk,
}));

fs.writeFileSync(path.join(PUBLIC, 'search-index.json'), JSON.stringify(index));

/* ---------- per-locale listing payload for instant client-side filtering ---------- */

const listing = {
  counts: cat.counts,
  categories: Object.fromEntries(
    Object.entries(buckets.category).map(([k, v]) => [k, v.length])
  ),
  types: Object.fromEntries(Object.entries(buckets.type).map(([k, v]) => [k, v.length])),
  capabilities: Object.fromEntries(
    Object.entries(buckets.capability).map(([k, v]) => [k, v.length])
  ),
  ranks: {
    popular: ranks.popular,
    stars: ranks.stars,
    newest: ranks.newest,
    name: ranks.name,
  },
};

fs.writeFileSync(path.join(PUBLIC, 'listing-index.json'), JSON.stringify(listing));

const kb = (f) => (fs.statSync(path.join(PUBLIC, f)).size / 1024).toFixed(0);
console.log('search-index.json', kb('search-index.json') + ' KB');
console.log('listing-index.json', kb('listing-index.json') + ' KB');
