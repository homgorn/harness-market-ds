import fs from 'node:fs';
import path from 'node:path';

const CDN_URL = process.env.CDN_URL || 'https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json';
const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'data');
const RAW_DIR = path.join(DATA_DIR, 'raw');
const SNAP_DIR = path.join(DATA_DIR, 'snapshots');

for (const d of [DATA_DIR, RAW_DIR, SNAP_DIR]) fs.mkdirSync(d, { recursive: true });

const today = new Date().toISOString().slice(0, 10);

async function main() {
  console.log('Fetching', CDN_URL);
  const res = await fetch(CDN_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const declared = json?.metadata?.pluginCount ?? json?.plugins?.length;
  const fetched = json?.plugins?.length ?? 0;
  console.log('Declared:', declared, 'Fetched:', fetched);
  if (declared && declared !== fetched) {
    console.warn(`DRIFT: declared ${declared} != fetched ${fetched}`);
  }
  // write raw
  fs.writeFileSync(path.join(RAW_DIR, `${today}.json`), JSON.stringify(json, null, 2));
  // snapshot
  fs.writeFileSync(path.join(SNAP_DIR, `${today}.json`), JSON.stringify(json, null, 2));
  // latest
  fs.writeFileSync(path.join(DATA_DIR, 'catalog.json'), JSON.stringify(json, null, 2));
  console.log('Wrote data/catalog.json and snapshot', today);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
