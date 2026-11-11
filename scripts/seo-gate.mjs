import fs from 'node:fs';
import path from 'node:path';

/**
 * SEO gate: checks the built HTML for the page-level requirements.
 * Samples pages across route types rather than reading all ~15,000 files.
 */
const DIST = 'dist';
const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
})(DIST);

const pick = (re, n) => files.filter((f) => re.test(f)).slice(0, n);
const groups = {
  home: pick(/^dist[\\/]index\.html$/, 3),
  detail: pick(/[\\/]p[\\/]/, 400),
  category: pick(/[\\/]category[\\/]/, 200),
  tag: pick(/[\\/]tag[\\/]/, 200),
  author: pick(/[\\/]author[\\/]/, 100),
  static: pick(/[\\/](about|privacy|terms|cookies|blog|changelog|security)[\\/]/, 20),
};

const problems = [];
let checked = 0;

for (const [kind, list] of Object.entries(groups)) {
  for (const f of list) {
    const html = fs.readFileSync(f, 'utf8');
    checked++;
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    const checks = [
      ['title missing', !!title],
      ['title > 60', title.length <= 60],
      ['title < 15', title.length >= 15],
      ['desc missing', !!desc],
      ['desc < 120', desc.length >= 120],
      ['desc > 160', desc.length <= 160],
      ['no canonical', html.includes('rel="canonical"')],
      ['no og:title', html.includes('property="og:title"')],
      ['no og:image', html.includes('property="og:image"')],
      ['no og:description', html.includes('property="og:description"')],
      ['no twitter:card', html.includes('name="twitter:card"')],
      ['no json-ld', html.includes('application/ld+json')],
      ['no hreflang', html.includes('hreflang=')],
      ['no h1', /<h1[\s>]/.test(html)],
      ['no lang attr', /<html lang="[a-z]{2}"/.test(html)],
      ['escaped doctype', !html.startsWith('&lt;!doctype')],
    ];
    for (const [name, ok] of checks) {
      if (!ok) problems.push({ kind, file: f, problem: name });
    }
  }
}

console.log('files in dist:', files.length, '| checked:', checked);
const byKind = {};
for (const p of problems) byKind[p.problem] = (byKind[p.problem] || 0) + 1;
console.log('problems:', problems.length, byKind);
if (problems.length) {
  const seen = new Set();
  for (const p of problems) {
    const key = p.kind + p.problem;
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(' -', key, p.file);
  }
  process.exit(1);
}
console.log('SEO gate passed');
