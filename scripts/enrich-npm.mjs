#!/usr/bin/env node
/**
 * Enrich plugins with npm registry metadata: keywords (→ tags), license,
 * weekly downloads, maintainers, deprecated flag.
 *
 * Cached in data/npm-cache/ so re-runs are cheap and idempotent.
 * Rate limit: npm registry allows ~2000 req/min for anonymous metadata reads;
 * we stay well below that with a concurrency gate.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const CACHE = path.join(DATA, 'npm-cache');
const OUT = path.join(DATA, 'npm-meta.json');
const CONCURRENCY = 12;

fs.mkdirSync(CACHE, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPkg(name) {
  const cacheFile = path.join(CACHE, `${name.replace(/[^a-zA-Z0-9._-]/g, '_')}.json`);
  if (fs.existsSync(cacheFile)) {
    try {
      return JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    } catch {
      /* refetch */
    }
  }
  const res = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
    headers: { accept: 'application/json' },
  });
  if (!res.ok) {
    await sleep(1200);
    return null;
  }
  const json = await res.json();
  const latest = json['dist-tags']?.latest;
  const v = latest ? json.versions?.[latest] : null;
  const payload = {
    keywords: v?.keywords || json.keywords || [],
    license: v?.license || null,
    homepage: v?.homepage || null,
    repository: typeof v?.repository === 'object' ? v.repository?.url : v?.repository || null,
    maintainers: (v?.maintainers || []).map((m) => m.name).slice(0, 5),
    deprecated: v?.deprecated || null,
    latest: latest || null,
    time: json.time?.modified || null,
    versionsCount: json.versions ? Object.keys(json.versions).length : 0,
  };
  fs.writeFileSync(cacheFile, JSON.stringify(payload));
  return payload;
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(path.join(DATA, 'catalog-v2.json'), 'utf8'));
  const pkgs = [...new Set(catalog.plugins.map((p) => p.npm).filter(Boolean))];
  console.log('npm packages to enrich:', pkgs.length);

  const out = {};
  let done = 0;
  let fails = 0;
  const queue = [...pkgs];

  async function worker() {
    while (queue.length) {
      const name = queue.shift();
      try {
        const meta = await fetchPkg(name);
        if (meta) out[name] = meta;
        else fails++;
      } catch (e) {
        fails++;
      }
      done++;
      if (done % 250 === 0) console.log(`  ${done}/${pkgs.length} (fails ${fails})`);
      await sleep(40);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  fs.writeFileSync(OUT, JSON.stringify({ generated: new Date().toISOString(), packages: out }));
  console.log('enriched:', Object.keys(out).length, 'fails:', fails);
  console.log('wrote data/npm-meta.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
