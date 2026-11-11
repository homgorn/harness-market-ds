#!/usr/bin/env node
/**
 * Merge the two catalog sources into one normalized dataset.
 *
 * Source A (primary): https://awesome-dsh-plugin.com/plugins.json
 *   - 10k+ plugins, npm AND GitHub-only
 *   - owner, stars, downloads, capabilities, capabilityRedLines, install, added, icon, screenshots
 * Source B (secondary): https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json
 *   - the format-1 index DSH "Discover" consumes; npm-only subset
 *
 * Output: data/catalog-v2.json  (normalized, one entry per plugin)
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const AWESOME_URL = 'https://awesome-dsh-plugin.com/plugins.json';
const CDN_URL = process.env.CDN_URL || 'https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json';

const slugify = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function normalize(awesomeList, cdnList) {
  const cdnByName = new Map();
  for (const p of cdnList || []) {
    cdnByName.set(p.name, p);
  }

  const out = [];
  const seen = new Set();

  for (const a of awesomeList) {
    const npmName = a.npm || null;
    const key = npmName ? `npm:${npmName}` : `gh:${a.owner}/${a.name}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const c = npmName ? cdnByName.get(npmName) : null;
    const slugBase = slugify(npmName || `${a.owner}-${a.name}`);
    const version = a.version || c?.versions?.[0]?.version || null;
    const engines = c?.versions?.[0]?.engines || {};

    out.push({
      slug: slugBase,
      name: a.name,
      npm: npmName,
      owner: a.owner,
      url: a.url,
      page: a.page,
      category: a.category,
      description: a.description || {},
      version,
      stars: a.stars ?? 0,
      downloads: a.downloads ?? 0,
      downloadsCheckedAt: a.downloadsCheckedAt || null,
      capabilities: a.capabilities || [],
      capabilityRedLines: a.capabilityRedLines || [],
      capabilityCheckedAt: a.capabilityCheckedAt || null,
      install: a.install || (npmName ? `dsh plugin --profile web add ${npmName}` : null),
      added: a.added || null,
      icon: a.icon || null,
      tarball: a.tarball || null,
      screenshots: a.screenshots || [],
      homepage: c?.homepage || a.url,
      repository: c?.repository?.url || a.url,
      engines,
      inCdnIndex: Boolean(c),
      sources: ['awesome', ...(c ? ['cdn'] : [])],
    });
  }

  // CDN-only plugins that the awesome registry does not list yet
  for (const c of cdnList || []) {
    if (a_seen(c, seen)) continue;
    const slugBase = slugify(c.name);
    if (out.some((p) => p.slug === slugBase)) continue;
    out.push({
      slug: slugBase,
      name: c.name,
      npm: c.name,
      owner: null,
      url: c.repository?.url || c.homepage,
      page: null,
      category: c.metadata?.category || 'fun',
      description: c.description || {},
      version: c.versions?.[0]?.version || null,
      stars: 0,
      downloads: 0,
      downloadsCheckedAt: null,
      capabilities: [],
      capabilityRedLines: [],
      capabilityCheckedAt: null,
      install: `dsh plugin --profile web add ${c.name}`,
      added: null,
      icon: null,
      tarball: null,
      screenshots: [],
      homepage: c.homepage,
      repository: c.repository?.url,
      engines: c.versions?.[0]?.engines || {},
      inCdnIndex: true,
      sources: ['cdn'],
    });
  }

  return out;
}

function a_seen(c, seen) {
  return seen.has(`npm:${c.name}`);
}

async function main() {
  fs.mkdirSync(path.join(DATA, 'snapshots'), { recursive: true });
  const today = new Date().toISOString().slice(0, 10);

  console.log('fetching awesome registry…');
  const awesome = await fetchJson(AWESOME_URL);
  console.log('awesome plugins:', awesome.plugins?.length, 'declared count:', awesome.count);

  console.log('fetching cdn index…');
  let cdn = { plugins: [] };
  try {
    cdn = await fetchJson(CDN_URL);
  } catch (e) {
    console.warn('cdn index unavailable:', e.message);
  }
  console.log('cdn plugins:', cdn.plugins?.length);

  const merged = normalize(awesome.plugins || [], cdn.plugins || []);

  // unique slugs
  const used = new Map();
  for (const p of merged) {
    let s = p.slug;
    let i = 2;
    while (used.has(s)) s = `${p.slug}-${i++}`;
    used.set(s, true);
    p.slug = s;
  }

  merged.sort((a, b) => (b.stars || 0) - (a.stars || 0) || a.name.localeCompare(b.name));

  const payload = {
    generated: new Date().toISOString(),
    sources: { awesome: AWESOME_URL, cdn: CDN_URL },
    counts: {
      merged: merged.length,
      awesome: awesome.plugins?.length || 0,
      cdn: cdn.plugins?.length || 0,
      declaredAwesome: awesome.count || null,
    },
    plugins: merged,
  };

  fs.writeFileSync(path.join(DATA, 'catalog-v2.json'), JSON.stringify(payload));
  fs.writeFileSync(
    path.join(DATA, 'snapshots', `${today}-v2.json`),
    JSON.stringify(payload)
  );

  const withCap = merged.filter((p) => p.capabilities.length).length;
  const withRed = merged.filter((p) => p.capabilityRedLines.length).length;
  console.log('merged:', merged.length);
  console.log('with capabilities:', withCap, '| with red lines:', withRed);
  console.log('wrote data/catalog-v2.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
