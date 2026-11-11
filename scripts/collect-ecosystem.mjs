#!/usr/bin/env node
/**
 * Collect NON-plugin DSH ecosystem artifacts: desktop apps, SaaS products,
 * hosted services, bots, sites, marketplaces, docs.
 *
 * Sources (primary):
 *   - GitHub search: repositories mentioning DeepSeek Harness / dsh-plugin topic
 *   - curated list derived from the awesome-dsh-plugin README "Friends" section
 *   - the OMDSH hub catalog "kind" taxonomy (channel = IM bots/connectors)
 *
 * Output: data/ecosystem.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const OUT = path.join(DATA, 'ecosystem.json');

function gh(args) {
  try {
    return JSON.parse(
      execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, shell: false })
    );
  } catch (e) {
    console.warn('gh failed:', args.join(' '), String(e.message).slice(0, 140));
    return null;
  }
}

const TOPICS = ['dsh-plugin', 'deepseek-harness', 'dsh', 'deepseek-harness-plugin'];
const found = new Map();

for (const topic of TOPICS) {
  const res = gh([
    'api',
    `search/repositories?q=topic:${topic}&sort=stars&order=desc&per_page=100`,
  ]);
  if (!res?.items) continue;
  for (const r of res.items) {
    if (found.has(r.full_name)) continue;
    const desc = (r.description || '').toLowerCase();
    const name = r.name.toLowerCase();
    let kind = 'repo';
    if (/desktop|tauri|electron|gui|app\b/.test(desc + ' ' + name)) kind = 'desktop';
    else if (/bot|telegram|qq\b|feishu|dingtalk|slack|discord|im\b|onebot/.test(desc + ' ' + name)) kind = 'bot';
    else if (/hosted|cloud|saas|server|relay|api\s*service|managed/.test(desc + ' ' + name)) kind = 'service';
    else if (/market|catalog|registry|index|hub\b|directory/.test(desc + ' ' + name)) kind = 'marketplace';
    else if (/doc|wiki|guide|tutorial|learn/.test(desc + ' ' + name)) kind = 'site';
    else if (/skill/.test(desc + ' ' + name)) kind = 'skill';
    else if (/mcp/.test(desc + ' ' + name)) kind = 'mcp';
    else if (/theme|skin/.test(desc + ' ' + name)) kind = 'theme';
    else if (/preset/.test(desc + ' ' + name)) kind = 'preset';
    found.set(r.full_name, {
      kind,
      id: r.full_name,
      name: r.name,
      owner: r.owner?.login || '',
      url: r.html_url,
      homepage: r.homepage || '',
      description: r.description || '',
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      language: r.language || '',
      license: r.license?.spdx_id || '',
      topics: r.topics || [],
      archived: !!r.archived,
      pushedAt: r.pushed_at || '',
      createdAt: r.created_at || '',
      updatedAt: r.updated_at || '',
      source: `github-topic:${topic}`,
    });
  }
  console.log(`topic ${topic}: total ${found.size}`);
}

// Curated: the "Friends" section of the upstream marketplace README lists
// desktop clients and marketplaces that have no npm package.
const CURATED = [
  { kind: 'desktop', id: 'dataelement/dsh-desktop', name: 'DSH Desktop', owner: 'dataelement', url: 'https://github.com/dataelement/dsh-desktop', homepage: 'https://dshdesktop.com', description: 'Desktop app for DeepSeek Harness with the plugin market preset bundled.', source: 'curated-friends' },
  { kind: 'desktop', id: 'hairyf/deepseek-harness-desktop', name: 'DeepSeek Harness Desktop (Tauri)', owner: 'hairyf', url: 'https://github.com/hairyf/deepseek-harness-desktop', homepage: '', description: 'Native Tauri desktop app for DeepSeek Harness.', source: 'curated-friends' },
  { kind: 'desktop', id: 'anywhere-labs/deepseek-harness-desktop', name: 'DeepSeek Harness Desktop (Electron)', owner: 'anywhere-labs', url: 'https://github.com/anywhere-labs/deepseek-harness-desktop', homepage: 'https://dshdesktop.cn', description: 'Electron desktop client built around the plugin idea.', source: 'curated-friends' },
  { kind: 'desktop', id: 'RyensX/dsh-app', name: 'DSH App', owner: 'RyensX', url: 'https://github.com/RyensX/dsh-app', homepage: '', description: 'Tauri 2 desktop client for DeepSeek Harness. AGPL-3.0.', source: 'curated-friends' },
  { kind: 'desktop', id: 'liangchen-harold/local-dsh', name: 'Local DSH', owner: 'liangchen-harold', url: 'https://github.com/liangchen-harold/local-dsh', homepage: 'https://localdsh.com', description: 'Desktop client that runs the model locally (llama.cpp bundled).', source: 'curated-friends' },
  { kind: 'desktop', id: 'MochiNek0/dsh-desktop', name: 'dsh desktop', owner: 'MochiNek0', url: 'https://github.com/MochiNek0/dsh-desktop', homepage: 'https://dsh-desktop.cc.cd', description: 'Cross-platform Tauri desktop client with runtime manager.', source: 'curated-friends' },
  { kind: 'marketplace', id: 'dsh-market/dsh-market', name: 'DSH Market', owner: 'dsh-market', url: 'https://github.com/dsh-market/dsh-market', homepage: 'https://dshmarket.com', description: 'The plugin market inside DeepSeek Harness.', source: 'curated-friends' },
  { kind: 'marketplace', id: 'awesome-dsh-plugin/awesome-dsh-plugin', name: 'Awesome DSH Plugin', owner: 'awesome-dsh-plugin', url: 'https://github.com/awesome-dsh-plugin/awesome-dsh-plugin', homepage: 'https://awesome-dsh-plugin.com', description: 'Community-curated registry of DeepSeek Harness plugins.', source: 'curated-friends' },
  { kind: 'marketplace', id: 'bobby-sheng/dshget-data', name: 'DSH Get data', owner: 'bobby-sheng', url: 'https://github.com/bobby-sheng/dshget-data', homepage: 'https://dshget.com', description: 'Normalized catalog snapshot behind dshget.com.', source: 'curated-friends' },
  { kind: 'service', id: 'omdsh-dev/dsh-hub-workshop', name: 'OMDSH Hub Workshop', owner: 'omdsh-dev', url: 'https://github.com/omdsh-dev/dsh-hub-workshop', homepage: '', description: 'Workshop/registry with admission state, install modes and failure isolation policy.', source: 'curated-friends' },
  { kind: 'service', id: 'hrhgit/deepseek-harness-plugin-manager', name: 'Plugin Manager (hrhgit)', owner: 'hrhgit', url: 'https://github.com/hrhgit/deepseek-harness-plugin-manager', homepage: '', description: 'Catalog v2 with availability and compatibility state per plugin.', source: 'curated-friends' },
  { kind: 'site', id: 'dsh-market/docs', name: 'DSH documentation', owner: 'dsh-market', url: 'https://github.com/deepseek-ai/deepseek-harness', homepage: 'https://github.com/deepseek-ai/deepseek-harness', description: 'Official DeepSeek Harness repository and documentation.', source: 'curated-friends' },
];

for (const c of CURATED) {
  if (!found.has(c.id)) {
    found.set(c.id, { stars: 0, forks: 0, topics: [], license: '', language: '', archived: false, pushedAt: '', createdAt: '', updatedAt: '', ...c });
  }
}

const items = [...found.values()];
const byKind = {};
for (const i of items) byKind[i.kind] = (byKind[i.kind] || 0) + 1;

fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      generated: new Date().toISOString(),
      counts: { total: items.length, byKind },
      items,
    },
    null,
    0
  )
);
console.log('ecosystem items:', items.length, byKind);
console.log('wrote data/ecosystem.json');
