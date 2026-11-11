/**
 * Renders complete HTML documents from the shared UI layer.
 * The catch-all route calls these and returns the result.
 */
import { html, LOCALES, esc, t, catTitle, prefix, pluginJsonLd, SITE } from './ui.js';
import { descFor } from './i18n.js';
import {
  listingBody,
  detailBody,
  facetsBody,
  navData,
  listingCard,
  PER_PAGE,
  ITEMS,
  PLUGINS,
  ECOSYSTEM,
  categoryFacets,
  kindFacets,
  navTags,
  navCapabilities,
  bucketItems,
  relatedItems,
  applyFilters,
  sortSlugs,
  paginate,
  getItem,
  tagTitle,
  SECURITY_STATS,
  indexableTags,
  indexableOwners,
} from './pages.js';

const RISK_KEY = { none: 'riskNone', low: 'riskLow', medium: 'riskMedium', high: 'riskHigh' };

export function render({ locale = 'en', title, description, path = '/', body, jsonLd, keywords }) {
  const nav = navData(locale);
  return html({
    locale,
    title,
    description,
    path,
    body,
    jsonLd,
    keywords,
    categories: nav.categories,
    tags: nav.tags,
  });
}

/* ---------------- home ---------------- */

export function renderHome(locale) {
  const pre = prefix(locale);
  const top = [...PLUGINS].sort((a, b) => b.dl - a.dl || b.st - a.st).slice(0, 24);
  const stars = [...PLUGINS].sort((a, b) => b.st - a.st).slice(0, 12);
  const kinds = kindFacets();
  const cats = categoryFacets(locale, catTitle);
  const eco = [...ECOSYSTEM].sort((a, b) => b.st - a.st).slice(0, 12);

  const body = `<h1>DSH Harness Ecosystem Catalog</h1>
<p class="lead">${PLUGINS.length} plugins and ${ECOSYSTEM.length} ecosystem artifacts — desktop apps, hosted services, bots, marketplaces and sites for DeepSeek Harness. Filter by category, capability and security risk.</p>

<div class="toolbar">
  <form action="${pre}/search/" method="get" style="display:contents">
    <input type="search" name="q" placeholder="${esc(t(locale, 'search'))}" />
    <button type="submit" class="pill">${esc(t(locale, 'search'))}</button>
  </form>
</div>

<h2>${esc(t(locale, 'categories'))}</h2>
<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr))">
  ${cats.map((c) => `<a class="card" href="${pre}/category/${c.slug}/"><span class="t">${esc(c.title)}</span><span class="d">${c.count}</span></a>`).join('')}
</div>

<h2>Types</h2>
<div class="meta">
  ${kinds.map((k) => `<a class="pill" href="${pre}/type/${k.id}/">${esc(k.title)} <span style="color:var(--muted)">${k.count}</span></a>`).join('')}
</div>

<h2>${esc(t(locale, 'popular'))}</h2>
<div class="grid">${top.map((p) => listingCard(p, locale)).join('')}</div>

<h2>${esc(t(locale, 'top'))}</h2>
<div class="grid">${stars.map((p) => listingCard(p, locale)).join('')}</div>

<h2>Ecosystem</h2>
<div class="grid">${eco.map((p) => listingCard(p, locale)).join('')}</div>

<h2>${esc(t(locale, 'security'))}</h2>
<p class="lead">${SECURITY_STATS.high} artifacts flagged high risk, ${SECURITY_STATS.advisories} with published advisories, ${SECURITY_STATS.none} without red lines. <a href="${pre}/security/">${esc(t(locale, 'security'))} →</a></p>`;

  return render({
    locale,
    title: `DSH Harness Plugin Catalog — ${PLUGINS.length} plugins & ecosystem artifacts`,
    description: `Browse ${PLUGINS.length} DeepSeek Harness plugins plus desktop apps, hosted services, bots and marketplaces. Filter by category, capability and security risk. Multilingual, SEO-optimized.`,
    path: '/',
    keywords: 'deepseek harness, dsh plugins, plugin catalog, dsh marketplace',
    body,
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'DSH Harness Ecosystem Catalog',
        url: SITE + '/',
        description: 'Catalog of DeepSeek Harness plugins and ecosystem artifacts.',
        inLanguage: LOCALES.map((l) => l.code),
      },
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'DSH Harness Ecosystem Catalog',
        url: SITE + '/',
        logo: SITE + '/og-default.png',
      },
    ],
  });
}

/* ---------------- listings ---------------- */

const TITLE_FOR = {
  category: (v, locale) => `${catTitle(v, locale)} plugins`,
  tag: (v) => `${tagTitle(v)} plugins`,
  type: (v) => `${v} artifacts`,
  capability: (v) => `${v} capability`,
  author: (v) => `Plugins by ${v}`,
};

export function renderListing({ locale, type, value, page = 1, query = {} }) {
  const pre = prefix(locale);
  const raw = bucketItems(type, value);
  const filtered = applyFilters(
    raw.map((s) => getItem(s)).filter(Boolean),
    query
  );
  const sorted = query.sort && query.sort !== 'popular' ? filtered : filtered;
  const pg = paginate(sorted, page, PER_PAGE);
  const title = (TITLE_FOR[type] || ((v) => v))(value, locale);
  const basePath = `${pre}/${type}/${encodeURIComponent(value)}/`;
  const path = basePath + (pg.page > 1 ? `${pg.page}/` : '');

  const body = `<h1>${esc(title)}</h1>
<p class="lead">${pg.total} ${esc(t(locale, 'results'))} — ${esc(type)}: ${esc(value)}</p>
${listingBody({ locale, items: pg.items, page: pg.page, pages: pg.pages, total: pg.total, basePath, query })}
<details><summary>${esc(t(locale, 'filters'))}</summary>${facetsBody({ locale })}</details>`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description: `${pg.total} DeepSeek Harness artifacts in ${type} "${value}".`,
    url: SITE + path,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + pre + '/' },
        { '@type': 'ListItem', position: 2, name: title, item: SITE + path },
      ],
    },
  };

  return render({
    locale,
    title: `${title} — DSH Harness Catalog`.slice(0, 60),
    description: `${pg.total} DeepSeek Harness artifacts in ${type} "${value}". Filter by capability and security risk.`,
    path,
    keywords: `dsh ${value}, deepseek harness ${type}`,
    body,
    jsonLd,
  });
}


/* ---------------- listing index pages ---------------- */

export function renderListingIndex({ locale, value }) {
  const pre = prefix(locale);
  const cats = categoryFacets(locale, catTitle);
  const kinds = kindFacets();
  const tags = navTags;
  const caps = navCapabilities;
  const owners = indexableOwners.slice(0, 60).map((o) => ({ slug: o, count: bucketItems('author', o).length }));

  const titles = {
    category: 'All categories',
    tags: 'All tags',
    type: 'Artifact types',
    capability: 'All capabilities',
    author: 'Authors',
  };
  const title = titles[value] || value;
  const descs = {
    category: `Browse all ${PLUGINS.length} DeepSeek Harness plugins grouped into ${cats.length} categories.`,
    tags: `Browse plugins by ${tags.length} tags derived from npm keywords and plugin capabilities.`,
    type: 'DeepSeek Harness plugins, MCP servers, skills, themes, presets, desktop apps, bots, hosted services, marketplaces and sites.',
    capability: 'Browse plugins by the capabilities they declare: filesystem, shell, network, credentials and more.',
    author: 'Browse DeepSeek Harness plugins by author.',
  };
  const description = descs[value] || '';

  let body = `<h1>${esc(title)}</h1><p class="lead">${esc(description)}</p>`;
  if (value === 'category') {
    body += `<div class="grid">${cats
      .map((c) => `<a class="card" href="${pre}/category/${c.slug}/"><span class="t">${esc(c.title)}</span><span class="d">${c.count}</span></a>`)
      .join('')}</div>`;
  } else if (value === 'type') {
    body += `<div class="grid">${kinds
      .map((k) => `<a class="card" href="${pre}/type/${k.id}/"><span class="t">${esc(k.title)}</span><span class="d">${k.count}</span></a>`)
      .join('')}</div>`;
  } else if (value === 'tags') {
    body += `<div class="meta">${tags
      .map((tg) => `<a class="pill" href="${pre}/tag/${tg.slug}/">${esc(tagTitle(tg.slug))} <span style="color:var(--muted)">${tg.count}</span></a>`)
      .join('')}</div>`;
  } else if (value === 'capability') {
    body += `<div class="meta">${caps
      .map((c) => `<a class="pill" href="${pre}/capability/${c.slug}/">${esc(c.slug)} <span style="color:var(--muted)">${c.count}</span></a>`)
      .join('')}</div>`;
  } else {
    body += `<div class="meta">${owners
      .map((o) => `<a class="pill" href="${pre}/author/${encodeURIComponent(o.slug)}/">${esc(o.slug)} <span style="color:var(--muted)">${o.count}</span></a>`)
      .join('')}</div>`;
  }

  return render({
    locale,
    title: `${title} — DSH Harness Catalog`.slice(0, 60),
    description,
    path: `${pre}/${value === 'tags' ? 'tags' : value}/`,
    keywords: `dsh ${value}, deepseek harness ${value}`,
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: SITE + `${pre}/${value === 'tags' ? 'tags' : value}/`,
    },
  });
}

/* ---------------- detail ---------------- */

export function renderDetail({ locale, slug }) {
  const item = getItem(slug);
  if (!item) return null;
  const related = relatedItems(item, 8);
  const body = detailBody({ locale, item, related });
  const path = `${prefix(locale)}/p/${item.s}/`;
  const { text } = descFor(item, locale);
  const title = `${item.n} — DSH ${item.k}`;
  let description = (text || '').slice(0, 155);
  if (description.length < 120) description = `${description} Artifact for DeepSeek Harness (DSH).`.slice(0, 160);
  const jsonLd = pluginJsonLd(item, locale, SITE + path);
  jsonLd.additionalType = 'https://schema.org/SoftwareApplication';
  jsonLd.breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + prefix(locale) + '/' },
      { '@type': 'ListItem', position: 2, name: catTitle(item.c, 'en'), item: SITE + prefix(locale) + `/category/${item.c}/` },
      { '@type': 'ListItem', position: 3, name: item.n, item: SITE + path },
    ],
  };
  return render({
    locale,
    title: title.slice(0, 60),
    description,
    path,
    keywords: [...(item.tg || []).slice(0, 5), 'dsh', 'deepseek harness', item.k].join(', '),
    body,
    jsonLd,
  });
}

/* ---------------- search ---------------- */

export function renderSearch({ locale, q }) {
  const pre = prefix(locale);
  const results = q ? ITEMS.filter((p) => {
    const hay = `${p.n} ${p.de} ${p.o} ${p.tg.join(' ')}`.toLowerCase();
    return String(q).toLowerCase().split(/\s+/).filter(Boolean).every((x) => hay.includes(x));
  }).slice(0, 120) : [];
  const body = `<h1>${esc(t(locale, 'search'))}</h1>
<div class="toolbar">
  <form action="${pre}/search/" method="get" style="display:contents">
    <input type="search" id="q" name="q" value="${esc(q || '')}" placeholder="${esc(t(locale, 'search'))}" autofocus />
    <button type="submit" class="pill">${esc(t(locale, 'search'))}</button>
  </form>
</div>
${q ? `<p class="lead">${results.length} ${esc(t(locale, 'results'))}</p><div class="grid" id="results">${results.map((p) => listingCard(p, locale)).join('')}</div>` : `<p class="lead">Type to search ${PLUGINS.length} plugins and the wider DSH ecosystem.</p>`}
<script src="/search.js" defer></script>`;
  return render({
    locale,
    title: q ? `${q} — search` : 'Search the DSH ecosystem catalog',
    description: `Search ${PLUGINS.length} DeepSeek Harness plugins and ecosystem artifacts by name, description, tag or author.`,
    path: `${pre}/search/`,
    body,
  });
}

/* ---------------- security ---------------- */

export function renderSecurity(locale) {
  const pre = prefix(locale);
  const groups = [
    ['high', SECURITY_STATS.high],
    ['medium', SECURITY_STATS.medium],
    ['low', SECURITY_STATS.low],
    ['none', SECURITY_STATS.none],
  ];
  const withAdvisory = PLUGINS.filter((p) => p.av > 0);
  const body = `<h1>${esc(t(locale, 'security'))}</h1>
<p class="lead">Every plugin is scanned for injection patterns, obfuscation and known advisories. Capability red lines come from the upstream registry; advisories come from OSV.dev.</p>
<h2>Overview</h2>
<table class="kv">
${groups.map(([k, v]) => `<tr><th><a href="#risk-${k}">${esc(t(locale, RISK_KEY[k]))}</a></th><td>${v}</td></tr>`).join('')}
<tr><th>${esc(t(locale, 'advTitle'))}</th><td>${withAdvisory.length}</td></tr>
</table>
${groups
  .map(([k, v]) => {
    const list = PLUGINS.filter((p) => p.rk === k).slice(0, 40);
    return `<h3 id="risk-${k}">${esc(t(locale, RISK_KEY[k]))} (${v})</h3>
${list.length ? `<div class="grid">${list.map((p) => listingCard(p, locale)).join('')}</div>` : '<p class="lead">None.</p>'}`;
  })
  .join('')}
${withAdvisory.length ? `<h3>${esc(t(locale, 'advTitle'))}</h3><div class="grid">${withAdvisory.map((p) => listingCard(p, locale)).join('')}</div>` : ''}`;
  return render({
    locale,
    title: 'Security report — DSH plugin catalog',
    description: `Security status of ${PLUGINS.length} DeepSeek Harness plugins: risk levels, capability red lines and published vulnerability advisories.`,
    path: `${pre}/security/`,
    body,
  });
}

/* ---------------- static pages ---------------- */

const STATIC_CONTENT = {
  about: {
    title: 'About the DSH Harness ecosystem catalog',
    body: (locale) => `<h1>About</h1>
<p class="lead">A searchable, security-scanned index of the DeepSeek Harness (DSH) ecosystem: ${PLUGINS.length} community plugins plus ${ECOSYSTEM.length} desktop apps, hosted services, bots, marketplaces and documentation sites.</p>
<h2>Where the data comes from</h2>
<ul>
<li><a href="https://awesome-dsh-plugin.com/plugins.json" rel="noopener nofollow">awesome-dsh-plugin.com</a> — community-curated registry (stars, downloads, capabilities, red lines)</li>
<li><a href="https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json" rel="noopener nofollow">dsh-plugin-catalog</a> — the format-1 index DSH's Discover tab consumes</li>
<li><a href="https://registry.npmjs.org/" rel="noopener nofollow">npm registry</a> — keywords, licenses, maintainers</li>
<li><a href="https://api.osv.dev/" rel="noopener nofollow">OSV.dev</a> — published vulnerability advisories</li>
</ul>
<h2>How security status is decided</h2>
<p>Capability red lines come from the upstream registry (for example a plugin that reads credentials and also has network access). Advisories come from OSV.dev. Nothing is executed on this site: the catalog holds metadata only.</p>
<h2>Translations</h2>
<p>Interface strings are translated into ${LOCALES.length} languages. Plugin descriptions are published in English and Chinese; in other languages the description is machine-translated and labelled as such.</p>`,
  },
  privacy: {
    title: 'Privacy',
    body: () => `<h1>Privacy</h1>
<p class="lead">This catalog is a static-content site. It does not require accounts and does not set advertising cookies.</p>
<h2>What is collected</h2>
<ul><li>Server access logs (IP address, user agent, requested path) retained by the hosting provider for abuse prevention.</li><li>Aggregate traffic statistics without cross-site tracking.</li></ul>
<h2>Local storage</h2>
<p>The theme preference (light or dark) is stored in your browser's local storage and never leaves your device.</p>
<h2>Third parties</h2>
<p>Plugin pages link to GitHub, npm and author websites. Following such a link places you under that site's privacy policy.</p>`,
  },
  terms: {
    title: 'Terms',
    body: (locale) => `<h1>Terms</h1>
<h2>Scope</h2>
<p>This site indexes third-party artifacts. Listing is not endorsement: plugins are community code and are installed at your own risk.</p>
<h2>Accuracy</h2>
<p>Metadata is mirrored from public registries and may be stale. Verify against the upstream source before installing.</p>
<h2>Licensing</h2>
<p>Each artifact keeps its own license, shown on its detail page. The catalog's own code is MIT licensed.</p>
<h2>Changes</h2>
<p>The catalog is refreshed daily from the upstream registry.</p>`,
  },
  cookies: {
    title: 'Cookies',
    body: () => `<h1>Cookies</h1>
<p class="lead">No cookies are set for tracking or advertising.</p>
<p>The only client-side storage used is <code>localStorage</code>, holding the light/dark theme choice. It contains no identifier and is never transmitted.</p>
<p>Outbound links to plugin repositories may set their own cookies under their own policies.</p>`,
  },
  blog: {
    title: 'Changelog and news',
    body: (locale) => `<h1>Changelog</h1>
<p class="lead">What changed in the catalog, in reverse chronological order.</p>
<h2>2026-11-11 — Ecosystem catalog</h2>
<ul><li>Merged the community registry (10,365 artifacts) with the DSH format-1 index (5,126) into one dataset of ${PLUGINS.length + ECOSYSTEM.length} items.</li><li>Added artifact types beyond plugins: desktop apps, hosted services, bots, marketplaces, sites.</li><li>Added pagination, capability facets, security risk levels and related-artifact recommendations.</li><li>Replaced Pagefind with a compact client-side index — Pagefind emitted ~72,000 index files, more than Cloudflare allows per deployment.</li></ul>
<h2>2026-11-10 — First deploy</h2>
<ul><li>Site scaffolded, catalog list and detail pages published.</li></ul>`,
  },
  changelog: {
    title: 'Changelog',
    body: () => `<h1>Changelog</h1>
<p>See the <a href="/blog/">news page</a> for the full history.</p>`,
  },
};

export function renderStaticPage({ locale, type }) {
  const pre = prefix(locale);
  const def = STATIC_CONTENT[type];
  if (!def) return null;
  return render({
    locale,
    title: def.title,
    description: `${def.title} — the DSH Harness ecosystem catalog.`,
    path: `${pre}/${type}/`,
    body: def.body(locale),
  });
}

export { listingCard, RISK_KEY };
