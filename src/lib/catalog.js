/**
 * Runtime catalog layer.
 *
 * Everything is precomputed at build time (scripts/build-ssr-data.mjs) because
 * a Worker request has a 10 ms CPU budget (Cloudflare Workers Free). At
 * request time this module does O(1) lookups only.
 */
import cat from '../../data/catalog.ssr.json' with { type: 'json' };
import buckets from '../../data/buckets.json' with { type: 'json' };
import ranks from '../../data/ranks.json' with { type: 'json' };
import relatedMap from '../../data/related.json' with { type: 'json' };

export const COUNTS = cat.counts;
export const ITEMS = cat.items;
export const PLUGINS = ITEMS.filter((i) => i.k === 'plugin');
export const ECOSYSTEM = ITEMS.filter((i) => i.k !== 'plugin');

export const KINDS = [
  { id: 'plugin', title: 'Plugins' },
  { id: 'mcp', title: 'MCP servers' },
  { id: 'skill', title: 'Skills' },
  { id: 'theme', title: 'Themes' },
  { id: 'preset', title: 'Presets' },
  { id: 'desktop', title: 'Desktop apps' },
  { id: 'bot', title: 'Bots' },
  { id: 'service', title: 'Hosted services' },
  { id: 'marketplace', title: 'Marketplaces' },
  { id: 'site', title: 'Sites & docs' },
];

const bySlug = new Map();
for (const it of ITEMS) if (!bySlug.has(it.s)) bySlug.set(it.s, it);

export const getItem = (slug) => bySlug.get(slug) || null;

/* ---------- buckets ---------- */

export const categorySlugs = Object.keys(buckets.category).sort(
  (a, b) => buckets.category[b].length - buckets.category[a].length
);
export const tagSlugs = Object.keys(buckets.tag).sort(
  (a, b) => buckets.tag[b].length - buckets.tag[a].length
);
export const ownerSlugs = Object.keys(buckets.owner).sort(
  (a, b) => buckets.owner[b].length - buckets.owner[a].length
);
export const capabilitySlugs = Object.keys(buckets.capability).sort(
  (a, b) => buckets.capability[b].length - buckets.capability[a].length
);
export const kindSlugs = Object.keys(buckets.type).sort(
  (a, b) => buckets.type[b].length - buckets.type[a].length
);

/** Tags and authors above this count are excluded from their own index page. */
export const TAG_PAGE_MIN = 4;
export const AUTHOR_PAGE_MIN = 2;

export const indexableTags = tagSlugs.filter((t) => buckets.tag[t].length >= TAG_PAGE_MIN);
export const indexableOwners = ownerSlugs.filter((o) => buckets.owner[o].length >= AUTHOR_PAGE_MIN);

export const navTags = tagSlugs.slice(0, 14).map((slug) => ({ slug, count: buckets.tag[slug].length }));
export const navCapabilities = capabilitySlugs.map((slug) => ({ slug, count: buckets.capability[slug].length }));

export function categoryFacets(locale, catTitleFn) {
  return categorySlugs.map((slug) => ({
    slug,
    count: buckets.category[slug].length,
    title: catTitleFn(slug, locale),
  }));
}

export function kindFacets() {
  const counts = new Map();
  for (const s of Object.keys(buckets.type)) counts.set(s, buckets.type[s].length);
  return KINDS.map((k) => ({ ...k, count: counts.get(k.id) || 0 })).filter((k) => k.count > 0);
}

/* ---------- lookups ---------- */

const BUCKET_FN = {
  category: (v) => buckets.category[v] || [],
  tag: (v) => buckets.tag[v] || [],
  type: (v) => buckets.type[v] || [],
  capability: (v) => buckets.capability[v] || [],
  author: (v) => buckets.owner[v] || [],
};

export const bucketItems = (type, value) => (BUCKET_FN[type] || (() => []))(value);

export const categoryItems = (v) => bucketItems('category', v);
export const kindItems = (v) => bucketItems('type', v);
export const tagItems = (v) => bucketItems('tag', v);
export const capabilityItems = (v) => bucketItems('capability', v);
export const ownerItems = (v) => bucketItems('author', v);

export const tagTitle = (slug) => slug.replace(/-/g, ' ');

/* ---------- sorting ---------- */

export const SORTS = ['popular', 'stars', 'newest', 'name'];

const RANK = {
  popular: ranks.popular,
  stars: ranks.stars,
  newest: ranks.newest,
  name: ranks.name,
};

/** Sort a bucket by rank (O(n log n) on numbers, no object allocation). */
export function sortSlugs(slugs, sort = 'popular') {
  const r = RANK[sort] || RANK.popular;
  return [...slugs].sort((a, b) => r[a] - r[b]);
}

export function sortItems(list, sort = 'popular') {
  const r = RANK[sort] || RANK.popular;
  return [...list].sort((a, b) => r[a.s] - r[b.s]);
}

/* ---------- filtering ---------- */

export function applyFilters(list, { q, capability, risk, kind } = {}) {
  let out = list;
  if (kind) out = out.filter((i) => i.k === kind);
  if (capability) out = out.filter((i) => (i.cp || []).includes(capability));
  if (risk) out = out.filter((i) => i.rk === risk);
  if (q) {
    const terms = String(q).toLowerCase().split(/\s+/).filter(Boolean);
    out = out.filter((i) => {
      const hay = `${i.n} ${i.de} ${i.o} ${i.tg.join(' ')}`.toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
  }
  return out;
}

/* ---------- search (client-side index is used in the browser) ---------- */

export function searchItems(q, limit = 80) {
  const needle = String(q || '').trim().toLowerCase();
  if (!needle) return [];
  const terms = needle.split(/\s+/).filter(Boolean);
  const out = [];
  for (const p of ITEMS) {
    const hay = `${p.n} ${p.de} ${p.o} ${p.c} ${p.tg.join(' ')}`.toLowerCase();
    let score = 0;
    let ok = true;
    for (const term of terms) {
      const idx = hay.indexOf(term);
      if (idx === -1) { ok = false; break; }
      score += idx === 0 ? 12 : term.length >= 4 ? 6 : 3;
    }
    if (!ok) continue;
    score += Math.min(p.dl / 500, 6) + Math.min(p.st / 20, 4);
    out.push({ p, score });
  }
  out.sort((a, b) => b.score - a.score || RANK.popular[a.p.s] - RANK.popular[b.p.s]);
  return out.slice(0, limit).map((x) => x.p);
}

/* ---------- related (precomputed) ---------- */

export function relatedItems(item, limit = 8) {
  if (!item) return [];
  const slugs = relatedMap[item.s] || [];
  const out = [];
  for (const s of slugs) {
    const it = bySlug.get(s);
    if (it) out.push(it);
  }
  return out.slice(0, limit);
}

/* ---------- pagination ---------- */

export function paginate(list, page, perPage) {
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page || 1), pages);
  const start = (current - 1) * perPage;
  return {
    items: list.slice(start, start + perPage),
    page: current,
    pages,
    total,
    perPage,
    hasPrev: current > 1,
    hasNext: current < pages,
  };
}

/* ---------- security ---------- */

export const SECURITY_STATS = {
  high: ITEMS.filter((p) => p.rk === 'high').length,
  medium: ITEMS.filter((p) => p.rk === 'medium').length,
  low: ITEMS.filter((p) => p.rk === 'low').length,
  none: ITEMS.filter((p) => p.rk === 'none').length,
  advisories: ITEMS.filter((p) => p.av > 0).length,
};
