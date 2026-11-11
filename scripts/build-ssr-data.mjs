#!/usr/bin/env node
/**
 * Build the runtime dataset for the edge renderer.
 *
 * Everything that could be computed at build time is computed here, because a
 * Worker request has a 10 ms CPU budget (Workers Free). The runtime must do
 * O(1) lookups only.
 *
 * Outputs:
 *   data/catalog.ssr.json  items (compact)
 *   data/buckets.json      bucket -> slugs in "popular" order
 *   data/ranks.json        sort mode -> slug -> rank
 *   data/related.json      slug -> [related slugs]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');

const site = JSON.parse(fs.readFileSync(path.join(DATA, 'site.json'), 'utf8'));
const ecosystem = JSON.parse(fs.readFileSync(path.join(DATA, 'ecosystem.json'), 'utf8'));

const trim = (s, n) => (s ? String(s).slice(0, n) : '');

const items = [];
const seen = new Set();

function push(it) {
  if (seen.has(it.s)) return;
  seen.add(it.s);
  items.push(it);
}

for (const p of site.plugins) {
  push({
    s: p.s,
    n: p.n,
    k: 'plugin',
    o: p.o,
    c: p.c,
    v: p.v,
    st: p.st,
    dl: p.dl,
    ad: p.ad,
    u: p.up,
    ic: p.ic,
    np: p.np,
    ins: p.ins,
    de: trim(p.de, 300),
    dz: trim(p.dz, 300),
    tg: p.tg.slice(0, 6),
    cp: p.cp,
    rl: p.rl,
    rk: p.rk,
    sc: p.sc.slice(0, 2),
    lc: p.lc,
    av: p.av,
    avs: p.avs,
    eng: p.eng,
    hp: '',
    lang: '',
    forks: 0,
    archived: 0,
  });
}

const KIND_SLUG = { repo: 'site' };
for (const i of ecosystem.items) {
  push({
    s: i.id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    n: i.name,
    k: KIND_SLUG[i.kind] || i.kind,
    o: i.owner || '',
    c: KIND_SLUG[i.kind] || i.kind,
    v: '',
    st: i.stars || 0,
    dl: 0,
    ad: i.createdAt || '',
    u: i.url,
    ic: '',
    np: '',
    ins: '',
    de: trim(i.description, 300),
    dz: '',
    tg: (i.topics || []).slice(0, 6),
    cp: [],
    rl: [],
    rk: 'none',
    sc: [],
    lc: i.license || '',
    av: 0,
    avs: [],
    eng: '',
    hp: i.homepage || '',
    lang: i.language || '',
    forks: i.forks || 0,
    archived: i.archived ? 1 : 0,
  });
}

/* ---------- buckets ---------- */

const buckets = { category: {}, tag: {}, owner: {}, capability: {}, type: {} };
for (const it of items) {
  (buckets.category[it.c] ||= []).push(it.s);
  (buckets.type[it.k] ||= []).push(it.s);
  if (it.o) (buckets.owner[it.o] ||= []).push(it.s);
  for (const t of it.tg || []) (buckets.tag[t] ||= []).push(it.s);
  for (const c of it.cp || []) (buckets.capability[c] ||= []).push(it.s);
}

/* ---------- ranks (numeric, so runtime sorting stays cheap) ---------- */

const cmpPopular = (a, b) => b.dl - a.dl || b.st - a.st || a.n.localeCompare(b.n);
const cmpStars = (a, b) => b.st - a.st || a.n.localeCompare(b.n);
const cmpNewest = (a, b) => (b.ad || '').localeCompare(a.ad || '') || b.dl - a.dl;
const cmpName = (a, b) => a.n.localeCompare(b.n);

const bySlug = new Map(items.map((i) => [i.s, i]));
const order = {
  popular: [...items].sort(cmpPopular),
  stars: [...items].sort(cmpStars),
  newest: [...items].sort(cmpNewest),
  name: [...items].sort(cmpName),
};

const ranks = {};
for (const [mode, list] of Object.entries(order)) {
  const r = {};
  list.forEach((it, idx) => (r[it.s] = idx));
  ranks[mode] = r;
}

// buckets stored in "popular" order
for (const kind of Object.keys(buckets)) {
  for (const key of Object.keys(buckets[kind])) {
    buckets[kind][key] = buckets[kind][key].sort((a, b) => ranks.popular[a] - ranks.popular[b]);
  }
}

/* ---------- related (precomputed; runtime must not scan 10k items) ---------- */

const tagSets = new Map(items.map((i) => [i.s, new Set(i.tg || [])]));
const related = {};
for (const it of items) {
  const tagSet = tagSets.get(it.s);
  const scored = [];
  for (const other of items) {
    if (other.s === it.s) continue;
    if (other.k !== it.k && it.k === 'plugin') continue;
    let score = 0;
    if (other.c === it.c) score += 10;
    const shared = (other.tg || []).filter((t) => tagSet.has(t)).length;
    score += shared * 3;
    if (other.o && other.o === it.o) score += 4;
    if ((other.cp || []).some((c) => (it.cp || []).includes(c))) score += 1;
    if (score <= 0) continue;
    scored.push([other.s, score + Math.min(other.dl / 800, 3)]);
  }
  scored.sort((a, b) => b[1] - a[1] || ranks.popular[a[0]] - ranks.popular[b[0]]);
  related[it.s] = scored.slice(0, 8).map((x) => x[0]);
}

/* ---------- write ---------- */

fs.writeFileSync(
  path.join(DATA, 'catalog.ssr.json'),
  JSON.stringify({
    generated: new Date().toISOString(),
    counts: {
      total: items.length,
      plugins: items.filter((i) => i.k === 'plugin').length,
      ecosystem: items.filter((i) => i.k !== 'plugin').length,
    },
    items,
  })
);
fs.writeFileSync(path.join(DATA, 'buckets.json'), JSON.stringify(buckets));
fs.writeFileSync(path.join(DATA, 'ranks.json'), JSON.stringify(ranks));
fs.writeFileSync(path.join(DATA, 'related.json'), JSON.stringify(related));

const mb = (f) => (fs.statSync(path.join(DATA, f)).size / 1048576).toFixed(2);
console.log('items:', items.length);
console.log('catalog.ssr.json', mb('catalog.ssr.json') + 'MB');
console.log('buckets.json', mb('buckets.json') + 'MB');
console.log('ranks.json', mb('ranks.json') + 'MB');
console.log('related.json', mb('related.json') + 'MB');
