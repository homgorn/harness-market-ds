#!/usr/bin/env node
/**
 * Generate llms.txt (agent-facing site summary) and llms-full.txt (machine
 * readable dump of the full catalog for answer-engine ingestion).
 *
 * Full dump is ~10,600 entries; each entry is one line: slug | kind | name |
 * category | risk | install | url. No description bodies to keep the file
 * small enough to ingest.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const PUBLIC = path.join(ROOT, 'public');
const SITE = 'https://harness-market-ds.refertur.net';
const LOCALES = ['en', 'ru', 'zh', 'es', 'de', 'fr', 'ja'];

const cat = JSON.parse(fs.readFileSync(path.join(DATA, 'catalog.ssr.json'), 'utf8'));

const lines = [];
lines.push('# DSH Harness Ecosystem Catalog — full dump');
lines.push('# generated ' + cat.generated + ' — ' + cat.counts.total + ' artifacts');
lines.push('# columns: slug | kind | name | category | risk | install');
lines.push('# source: https://awesome-dsh-plugin.com/plugins.json + DSH format-1 index');
for (const i of cat.items) {
  lines.push([
    i.s,
    i.k,
    i.n.replace(/\|/g, '/').slice(0, 60),
    i.c,
    i.rk,
    (i.ins || '').replace(/\|/g, '/'),
  ].join(' | '));
}

fs.writeFileSync(path.join(PUBLIC, 'llms-full.txt'), lines.join('\n') + '\n');

const bytes = fs.statSync(path.join(PUBLIC, 'llms-full.txt')).size;
console.log('llms-full.txt bytes:', bytes, '| lines:', lines.length);
