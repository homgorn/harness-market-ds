#!/usr/bin/env node
/**
 * Build the compact site dataset consumed by the Astro app.
 *
 * Inputs:
 *   data/catalog-v2.json   merged awesome-registry + CDN index (10368 plugins)
 *   data/npm-meta.json     npm registry metadata (keywords -> tags, license)
 *   data/security.json     OSV advisories (produced by scripts/scan-osv.mjs)
 *
 * Outputs:
 *   data/site.json         compact plugin records (bundle-sized)
 *   data/tags.json         tag -> {count, plugins[]}
 *   data/categories.json   category -> {count, title{en,zh}}
 *   data/owners.json       owner -> {count, plugins[]}
 *
 * Everything here is deterministic: re-running converges to the same output.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));

const catalog = readJson('catalog-v2.json');
const npmMeta = readJson('npm-meta.json').packages || {};
const security = fs.existsSync(path.join(DATA, 'security.json'))
  ? readJson('security.json')
  : { advisories: {} };

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

const STOP = new Set([
  'dsh','deepseek','harness','plugin','plugins','cordis','agent','tool','tools','the','and','for','with','a','an','of','to','in','on','my','your','cli','app','use','via','not','or','is','it','this','that','by','from','at','as','be','we','you','all','new','one','two','get','set','add','run','can','more','make','build','using','use','support','supports','based','via','out','own','per','has','have','will','when','where','who','why','how','what','which','any','some','more','most','other','also','only','just','like','need','needs','want','work','works','working','example','examples','homepage','github','https','http','www','com','io','org','net','html','index','readme','license','mit','apache','bsd','gpl','version','versions','latest','beta','alpha','rc','v1','v2','v3','0','1','2','3',
]);

function deriveTags(p) {
  const meta = p.npm ? npmMeta[p.npm] : null;
  const raw = [];
  if (meta?.keywords) raw.push(...meta.keywords);
  // derive from name/owner tokens
  const tokens = `${p.name} ${p.owner || ''}`.toLowerCase().split(/[^a-z0-9]+/);
  for (const tk of tokens) {
    if (tk.length >= 4 && !STOP.has(tk) && !tk.startsWith('dsh')) raw.push(tk);
  }
  // capabilities become tags too (they are real attributes)
  for (const c of p.capabilities || []) raw.push(`cap-${c}`);
  const seen = new Set();
  const tags = [];
  for (const t of raw) {
    const s = slugify(t);
    if (!s || s.length < 3 || seen.has(s)) continue;
    seen.add(s);
    tags.push(s);
    if (tags.length >= 8) break;
  }
  return tags;
}

function riskLevel(p) {
  const rl = p.capabilityRedLines || [];
  if (!rl.length) return 'none';
  const joined = rl.join(' | ').toLowerCase();
  if (joined.includes('postinstall') || joined.includes('credentials/secrets')) return 'high';
  if (joined.includes('http://') || joined.includes('literal ip')) return 'medium';
  return 'low';
}

const adv = security.advisories || {};
const plugins = [];

for (const p of catalog.plugins) {
  const meta = p.npm ? npmMeta[p.npm] : null;
  const advisories = p.npm ? adv[p.npm] || [] : [];
  const tags = deriveTags(p);
  const risk = riskLevel(p);
  plugins.push({
    s: p.slug,
    n: p.name,
    o: p.owner || '',
    c: p.category,
    v: p.version || '',
    st: p.stars || 0,
    dl: p.downloads || 0,
    ad: p.added || '',
    up: p.url,
    ic: p.icon || '',
    np: p.npm || '',
    ins: p.install || '',
    de: (p.description?.en || '').slice(0, 420),
    dz: (p.description?.zh || '').slice(0, 420),
    tg: tags,
    cp: p.capabilities || [],
    rl: (p.capabilityRedLines || []).slice(0, 3),
    rk: risk,
    sc: p.screenshots ? p.screenshots.slice(0, 3) : [],
    lc: meta?.license || '',
    ks: meta?.keywords ? meta.keywords.slice(0, 8) : [],
    av: advisories.length,
    avs: advisories.slice(0, 3).map((a) => a.id),
    eng: p.engines && Object.keys(p.engines).length ? p.engines.dsh || '' : '',
  });
}

// indexes
const tagsIndex = {};
const catsIndex = {};
const ownersIndex = {};
for (const p of plugins) {
  for (const t of p.tg) (tagsIndex[t] ||= { count: 0, plugins: [] }).plugins.push(p.s), tagsIndex[t].count++;
  (catsIndex[p.c] ||= { count: 0, plugins: [] }).plugins.push(p.s), catsIndex[p.c].count++;
  if (p.o) (ownersIndex[p.o] ||= { count: 0, plugins: [] }).plugins.push(p.s), ownersIndex[p.o].count++;
}

const site = {
  generated: new Date().toISOString(),
  counts: {
    plugins: plugins.length,
    tags: Object.keys(tagsIndex).length,
    categories: Object.keys(catsIndex).length,
    owners: Object.keys(ownersIndex).length,
    withAdvisory: plugins.filter((p) => p.av > 0).length,
    highRisk: plugins.filter((p) => p.rk === 'high').length,
  },
  plugins,
};

fs.writeFileSync(path.join(DATA, 'site.json'), JSON.stringify(site));
fs.writeFileSync(path.join(DATA, 'tags.json'), JSON.stringify(tagsIndex));
fs.writeFileSync(path.join(DATA, 'categories.json'), JSON.stringify(catsIndex));
fs.writeFileSync(path.join(DATA, 'owners.json'), JSON.stringify(ownersIndex));

console.log('plugins:', site.counts.plugins);
console.log('tags:', site.counts.tags, '| categories:', site.counts.categories, '| owners:', site.counts.owners);
console.log('with advisories:', site.counts.withAdvisory, '| high risk:', site.counts.highRisk);
console.log('site.json MB:', (fs.statSync(path.join(DATA, 'site.json')).size / 1048576).toFixed(2));
