#!/usr/bin/env node
/**
 * Generate llms.txt (agent-facing site summary) and the shared search index.
 *
 * Sitemaps are produced by @astrojs/sitemap during the Astro build, one build
 * per locale (see BUILD_LOCALES), so this script does not touch them.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const PUBLIC = path.join(ROOT, 'public');
const SITE = 'https://harness-market-ds.refertur.net';
const LOCALES = ['en', 'ru', 'zh', 'es', 'de', 'fr', 'ja'];

const site = JSON.parse(fs.readFileSync(path.join(DATA, 'site.json'), 'utf8'));
const eco = JSON.parse(fs.readFileSync(path.join(DATA, 'ecosystem.json'), 'utf8'));

fs.mkdirSync(PUBLIC, { recursive: true });

/* ---------- llms.txt ---------- */

const items = [
  ...site.plugins.map((p) => ({ s: p.s, n: p.n, k: 'plugin', dl: p.dl, st: p.st })),
  ...eco.items.map((i) => ({
    s: i.id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    n: i.name,
    k: i.kind,
    dl: 0,
    st: i.stars || 0,
  })),
];
const top = [...items].sort((a, b) => b.dl - a.dl || b.st - a.st).slice(0, 60);

fs.writeFileSync(
  path.join(PUBLIC, 'llms.txt'),
  `# DSH Harness Ecosystem Catalog

> Multilingual catalog of DeepSeek Harness (DSH) plugins and ecosystem artifacts: plugins, MCP servers, skills, themes, desktop apps, hosted services, bots and marketplaces. Filter by category, capability and security risk.

## Page types
- Plugin / artifact detail: ${SITE}/p/<slug>/
- Category: ${SITE}/category/<category>/
- Type: ${SITE}/type/<kind>/
- Capability: ${SITE}/capability/<capability>/
- Author: ${SITE}/author/<owner>/
- Security report: ${SITE}/security/
- Search: ${SITE}/search/?q=<query>

## Languages
${LOCALES.map((l) => `- ${l}: ${SITE}/${l === 'en' ? '' : l + '/'}`).join('\n')}

## Most used artifacts
${top.map((i) => `- ${i.n} — ${SITE}/p/${i.s}/ (${i.k}, ${i.dl || 0} downloads, ${i.st || 0} stars)`).join('\n')}

## Data
- Catalog JSON: ${SITE}/data/catalog.json
- Sources: https://awesome-dsh-plugin.com/plugins.json and https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json
`
);

/* ---------- client search index ---------- */

const index = items.map((i) => ({
  s: i.s,
  n: i.n,
  k: i.k,
  d: (site.plugins.find((p) => p.s === i.s)?.de || '').slice(0, 180),
}));

fs.writeFileSync(path.join(PUBLIC, 'search-index.json'), JSON.stringify(index));

console.log('llms.txt entries:', top.length, '| search index:', index.length);
console.log('search-index.json MB:', (fs.statSync(path.join(PUBLIC, 'search-index.json')).size / 1048576).toFixed(2));
