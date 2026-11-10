import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const catalogPath = path.join(ROOT, 'data', 'catalog.json');
const outPath = path.join(ROOT, 'data', 'security-status.json');

if (!fs.existsSync(catalogPath)) {
  console.error('data/catalog.json not found; run npm run sync first');
  process.exit(1);
}
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
const status = {};
for (const p of catalog.plugins || []) {
  status[p.name] = {
    slug: p.name,
    status: 'unknown',
    scannedAt: null,
    findings: [],
    note: 'scan not yet run',
  };
}
fs.writeFileSync(outPath, JSON.stringify({ generated: new Date().toISOString(), plugins: status }, null, 2));
console.log('Wrote security-status.json for', Object.keys(status).length, 'plugins');
console.log('NOTE: real scanning (Semgrep+YARA) to be wired in CI (WBS-4.1).');
