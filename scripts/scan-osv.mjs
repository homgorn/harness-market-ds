#!/usr/bin/env node
/**
 * Query OSV.dev for known vulnerabilities in the npm packages of the catalog.
 * OSV has no API key and no hard rate limit for reasonable batch sizes.
 * Output: data/security.json  { advisories: { "<npm-name>": [ {id, severity, summary} ] } }
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const OUT = path.join(DATA, 'security.json');
const BATCH = 100;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function queryBatch(pkgs) {
  const res = await fetch('https://api.osv.dev/v1/querybatch', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      queries: pkgs.map((p) => ({ package: { name: p, ecosystem: 'npm' } })),
    }),
  });
  if (!res.ok) throw new Error(`OSV ${res.status}`);
  return res.json();
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(path.join(DATA, 'catalog-v2.json'), 'utf8'));
  const pkgs = [...new Set(catalog.plugins.map((p) => p.npm).filter(Boolean))];
  console.log('packages to scan:', pkgs.length);

  const advisories = {};
  for (let i = 0; i < pkgs.length; i += BATCH) {
    const slice = pkgs.slice(i, i + BATCH);
    try {
      const { results } = await queryBatch(slice);
      slice.forEach((pkg, idx) => {
        const vulns = results[idx]?.vulns || [];
        if (vulns.length) {
          advisories[pkg] = vulns.map((v) => ({
            id: v.id,
            modified: v.modified,
            summary: (v.summary || '').slice(0, 180),
          }));
        }
      });
    } catch (e) {
      console.warn('batch failed at', i, e.message);
      await sleep(2000);
    }
    if ((i / BATCH) % 10 === 0) console.log(`  ${i}/${pkgs.length}, flagged ${Object.keys(advisories).length}`);
  }

  fs.writeFileSync(OUT, JSON.stringify({ generated: new Date().toISOString(), advisories }, null, 0));
  console.log('packages with advisories:', Object.keys(advisories).length);
  console.log('wrote data/security.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
