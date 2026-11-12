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
    title: `DSH Harness Ecosystem Catalog — ${PLUGINS.length} plugins & artifacts`,
    description: `Browse ${PLUGINS.length} DeepSeek Harness plugins and ecosystem artifacts: desktop apps, services, bots. Filter by type, category, capability, security. Free to use.`,
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

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
    title: `${title.slice(0, 46)} - DSH Catalog`.slice(0, 60),
    description: `Browse ${pg.total} DeepSeek Harness ${type} artifacts for "${value.slice(0, 40)}". Filter by category, capability, risk. Updated daily.`,
      url: SITE + path,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + pre + '/' },
        { '@type': 'ListItem', position: 2, name: title, item: SITE + path },
      ],
    },
  ];

  return render({
    locale,
    title: `${title.slice(0, 46)} - DSH Catalog`.slice(0, 60),
    description: `Browse ${pg.total} DeepSeek Harness ${type} artifacts for "${value.slice(0, 40)}". Filter by category, capability, risk. Updated daily.`,
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
    author: 'Browse more than 1,600 DeepSeek Harness plugin authors with at least 2 plugins each, sorted by popularity and updated daily.',
    category: 'Browse all DeepSeek Harness plugins grouped into 23 categories, sorted by popularity and updated daily from the community registry.',
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
  const title = `${item.n.slice(0, 46)} — DSH ${item.k}`;
  let description = (text || '').slice(0, 155);
  if (description.length < 120) {
    description = `${item.n}: DeepSeek Harness ${item.k} artifact. Open-source DSH ecosystem project, security-scanned, installable via dsh plugin add.`.slice(0, 158);
  }
  const appSchema = pluginJsonLd(item, locale, SITE + path);
  appSchema.additionalType = 'https://schema.org/SoftwareApplication';
  const jsonLd = [
    appSchema,
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + prefix(locale) + '/' },
        { '@type': 'ListItem', position: 2, name: catTitle(item.c, 'en'), item: SITE + prefix(locale) + `/category/${item.c}/` },
        { '@type': 'ListItem', position: 3, name: item.n, item: SITE + path },
      ],
    },
  ];
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
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Security report — DSH plugin catalog',
      url: SITE + `${pre}/security/`,
    },
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
    title: 'Privacy policy page',
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
    title: 'Terms of use',
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
    title: 'Cookies and local storage',
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

  faq: {
    title: 'Frequently asked questions — DSH Harness Catalog',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What is DSH Harness?', acceptedAnswer: { '@type': 'Answer', text: 'DeepSeek Harness is an agent harness: an open-source runtime you install with dsh and extend with plugins.' } },
        { '@type': 'Question', name: 'How do I install a plugin?', acceptedAnswer: { '@type': 'Answer', text: 'Run: dsh plugin --profile web add <author>/<name>. The catalog shows the exact command on every plugin page.' } },
        { '@type': 'Question', name: 'Are the plugins safe?', acceptedAnswer: { '@type': 'Answer', text: 'Every plugin is scanned with Semgrep, npm audit and custom YARA rules, and cross-checked against capability red lines from the upstream registry and OSV advisories. Status is shown on each page as risk: none, low, medium or high.' } },
        { '@type': 'Question', name: 'What does the risk level mean?', acceptedAnswer: { '@type': 'Answer', text: 'high = reads credentials or secrets and has network access, or runs code at install time (postinstall). medium = plaintext HTTP or literal-IP egress. low = other red lines. none = no red lines detected.' } },
        { '@type': 'Question', name: 'Are descriptions translated?', acceptedAnswer: { '@type': 'Answer', text: 'UI is translated into 7 languages. Plugin descriptions are published in English and Chinese; in other languages they are machine-translated and labelled as such.' } },
        { '@type': 'Question', name: 'Where does the data come from?', acceptedAnswer: { '@type': 'Answer', text: 'Merged from awesome-dsh-plugin.com/plugins.json (10,365 artifacts) with the DSH format-1 index (5,126 plugins), enriched with npm registry metadata and OSV advisories.' } },
        { '@type': 'Question', name: 'Can I report a malicious plugin?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — open a security report through the SECURITY.md policy in the repository. We mark the plugin malicious, remove its code, and rewrite it as a safe plugin where feasible.' } },
        { '@type': 'Question', name: 'Does the catalog cost money?', acceptedAnswer: { '@type': 'Answer', text: 'No. The catalog is free. Premium ebooks, spec packs and PDF bundles, built from original work, will be sold via Lemon Squeezy — see the about page.' } },
      ],
    },
    body: (locale) => `<h1>Frequently asked questions</h1>
<h2>What is DSH Harness?</h2>
<p class="lead">DeepSeek Harness (DSH) is an agent harness — an open-source, extensible runtime installed with <code>dsh</code>. Its plugin ecosystem is what this catalog indexes.</p>
<h2>How do I install a plugin?</h2>
<pre><code>dsh plugin --profile web add &lt;name&gt;</code></pre>
<p>Replace the profile with yours if not <code>web</code>. Every plugin page shows the exact command.</p>
<h2>Are the plugins safe?</h2>
<p>All plugins are statically scanned (Semgrep, npm audit, YARA) and checked against upstream capability red lines and OSV advisories. Nothing is executed on this site — it holds metadata only.</p>
<h2>What do the risk levels mean?</h2>
<ul><li><strong>High</strong> — reads credentials/secrets + network, or postinstall code execution.</li><li><strong>Medium</strong> — plaintext HTTP / literal-IP egress.</li><li><strong>Low</strong> — other upstream red lines.</li><li><strong>None</strong> — no red lines.</li></ul>
<h2>Where does the data come from?</h2>
<ul><li>awesome-dsh-plugin.com/plugins.json — community registry (stars, downloads, capabilities, red lines)</li><li>dsh-plugin-catalog index.json — the format-1 index used by DSH Discover</li><li>npm registry — keywords, licenses, maintainers</li><li>OSV.dev — published vulnerability advisories</li></ul>
<h2>Are descriptions translated?</h2>
<p>Interface into 7 languages. Descriptions are EN and ZH upstream; other languages are machine-translated and labelled as such.</p>
<h2>How do I report a malicious plugin?</h2>
<p>Use the security procedure in <a href="https://github.com/homgorn/harness-market-ds/blob/main/SECURITY.md" rel="noopener nofollow">SECURITY.md</a>. We mark it, remove the code, and rewrite it safely where possible.</p>
<h2>Is it free?</h2>
<p>Yes. The catalog is free; premium original products arrive later via Lemon Squeezy.</p>`,
  },
  docs: {
    title: 'Docs — using the DSH catalog',
    jsonLd: null,
    body: (locale) => `<h1>Docs</h1>
<p class="lead">How to find, vet and install DSH plugins and artifacts.</p>
<h2>1. Search</h2>
<p>Use the search page (type-ahead, client-side). Filter by category, tag, capability or type.</p>
<h2>2. Vet</h2>
<p>Open the plugin page. Check stars, downloads, license, and the security risk pill. Red lines are listed under “Security risk”.</p>
<h2>3. Install</h2>
<pre><code>dsh plugin --profile web add &lt;name&gt;</code></pre>
<h2>4. Keep it updated</h2>
<p>Compare the version shown on the page with the latest on npm, and re-run the install command.</p>
<h2>5. What's indexed</h2>
<p>Plugins, MCP servers, skills, themes, presets, desktop apps, bots, hosted services, marketplaces and documentation sites — not only plugins.</p>`,
  },
  changelog: {
    title: 'Changelog — DSH Catalog',
    body: () => `<h1>Changelog</h1>
<p>See the <a href="/blog/">news page</a> for the full history.</p>`,
  },
};

export function renderStaticPage({ locale, type }) {
  const pre = prefix(locale);
  const def = STATIC_CONTENT[type];
  if (!def) return null;
  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: def.title,
    url: SITE + `${prefix(locale)}/${type}/`,
  };
  return render({
    locale,
    title: def.title.length > 60 ? def.title.slice(0, 57) + '…' : def.title,
    description: `${def.title} for the DeepSeek Harness (DSH) ecosystem: plugins, desktop apps, services and bots, security-scanned and always fresh.`,
    path: `${pre}/${type}/`,
    body: def.body(locale),
    jsonLd: def.jsonLd ? [def.jsonLd, pageJsonLd] : pageJsonLd,
  });
}

export { listingCard, RISK_KEY };
