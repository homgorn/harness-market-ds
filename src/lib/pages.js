/**
 * Page body builders — shared by every route so listings, cards and detail
 * pages look and behave identically across locales.
 */
import { pager, pluginJsonLd, t, catTitle, prefix, esc, SITE } from './ui.js';
import { descFor } from './i18n.js';
import {
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
  SECURITY_STATS,
  getItem,
  tagTitle,
  indexableTags,
  indexableOwners,
} from './catalog.js';

export const PER_PAGE = 48;

export function navData(locale) {
  return {
    categories: categoryFacets(locale, catTitle).slice(0, 23),
    tags: navTags,
  };
}

/** Compact card used in listings (plugin or ecosystem artifact). */
export function listingCard(p, locale) {
  const pre = prefix(locale);
  const { text } = descFor(p, locale);
  const risk =
    p.rk === 'high'
      ? '<span class="pill bad">high risk</span>'
      : p.rk === 'medium'
        ? '<span class="pill warn">medium risk</span>'
        : p.av > 0
          ? `<span class="pill warn">${p.av} CVE</span>`
          : '';
  return `<article class="card">
  <a class="t" href="${pre}/p/${p.s}/">${esc(p.n)}</a>
  <p class="d">${esc(text)}</p>
  <div class="meta">
    <span class="pill">${esc(p.k)}</span>
    <span class="pill">${esc(catTitle(p.c, locale))}</span>
    ${p.st ? `<span class="pill">★ ${p.st}</span>` : ''}
    ${p.dl ? `<span class="pill">↓ ${p.dl}</span>` : ''}
    ${risk}
  </div>
</article>`;
}

/** Filter bar + result list. */
export function listingBody({ locale, items, page, pages, total, basePath, query = {} }) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v) q.set(k, v);
  const qs = q.toString();
  const addParam = (k, v) => {
    const nq = new URLSearchParams(qs);
    nq.set(k, v);
    return `${basePath}${qs ? `?${nq}` : ''}`;
  };

  const filterBar = `<div class="toolbar">
  <form action="${basePath}" method="get" style="display:contents">
    <input type="search" name="q" placeholder="${esc(t(locale, 'search'))}" value="${esc(query.q || '')}" />
    ${query.kind ? `<input type="hidden" name="kind" value="${esc(query.kind)}" />` : ''}
    <select name="sort" onchange="this.form.submit()">
      <option value="popular"${query.sort === 'popular' || !query.sort ? ' selected' : ''}>${esc(t(locale, 'popular'))}</option>
      <option value="stars"${query.sort === 'stars' ? ' selected' : ''}>${esc(t(locale, 'top'))}</option>
      <option value="newest"${query.sort === 'newest' ? ' selected' : ''}>${esc(t(locale, 'newest'))}</option>
      <option value="name"${query.sort === 'name' ? ' selected' : ''}>${esc(t(locale, 'name'))}</option>
    </select>
    <button type="submit" class="pill">${esc(t(locale, 'filters'))}</button>
  </form>
</div>`;

  const chips = [];
  if (query.kind) chips.push(`<a class="pill" href="${addParam('kind', '')}">kind: ${esc(query.kind)} ✕</a>`);
  if (query.capability) chips.push(`<a class="pill" href="${addParam('capability', '')}">${esc(query.capability)} ✕</a>`);
  if (query.risk) chips.push(`<a class="pill" href="${addParam('risk', '')}">${esc(query.risk)} ✕</a>`);

  return `${filterBar}
${chips.length ? `<div class="meta" style="margin:-.4rem 0 1rem">${chips.join('')}</div>` : ''}
<p class="lead" style="margin:.2rem 0 .9rem">${total} ${esc(t(locale, 'results'))}</p>
<div class="grid">${items.map((i) => listingCard(i, locale)).join('')}</div>
${pager(basePath, page, pages, locale)}`;
}

/** Full plugin/entity detail body. */
export function detailBody({ locale, item, related }) {
  const pre = prefix(locale);
  const { text, machine } = descFor(item, locale);
  const riskPill =
    item.rk === 'high'
      ? `<span class="pill bad">${esc(t(locale, 'riskHigh'))}</span>`
      : item.rk === 'medium'
        ? `<span class="pill warn">${esc(t(locale, 'riskMedium'))}</span>`
        : item.rk === 'low'
          ? `<span class="pill warn">${esc(t(locale, 'riskLow'))}</span>`
          : `<span class="pill ok">${esc(t(locale, 'riskNone'))}</span>`;

  const stars = item.st ? `<span class="pill">★ ${item.st}</span>` : '';
  const dls = item.dl ? `<span class="pill">↓ ${item.dl}</span>` : '';
  const lic = item.lc ? `<span class="pill">${esc(item.lc)}</span>` : '';
  const kindPill = `<span class="pill">${esc(item.k)}</span>`;
  const ver = item.v ? `<span class="pill">v${esc(item.v)}</span>` : '';

  const tags = (item.tg || []).length
    ? `<div class="meta" style="margin-top:.6rem">${item.tg
        .map((tg) => `<a class="pill" href="${pre}/tag/${tg}/">${esc(tagTitle(tg))}</a>`)
        .join('')}</div>`
    : '';

  const caps = (item.cp || []).length
    ? `<div class="meta" style="margin-top:.5rem">${item.cp
        .map((c) => `<a class="pill" href="${pre}/capability/${c}/">${esc(c)}</a>`)
        .join('')}</div>`
    : '';

  const redlines = (item.rl || []).length
    ? `<h3>${esc(t(locale, 'risk'))}</h3><ul style="color:var(--warn)">${item.rl.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>`
    : '';

  const adv = (item.avs || []).length
    ? `<h3>${esc(t(locale, 'advTitle'))}</h3><ul>${item.avs.map((a) => `<li><code>${esc(a)}</code></li>`).join('')}</ul>`
    : '';

  const install = item.ins
    ? `<h2>${esc(t(locale, 'installCmd'))}</h2><pre><code>${esc(item.ins)}</code></pre>`
    : '';

  const shots = (item.sc || []).length
    ? `<h2>Screenshots</h2><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr))">${item.sc
        .map(
          (s) =>
            `<img src="${esc(s)}" alt="${esc(item.n)} screenshot" loading="lazy" width="480" height="300" style="width:100%;border-radius:8px;border:1px solid var(--border)">`
        )
        .join('')}</div>`
    : '';

  const links = [];
  if (item.u) links.push(`<a href="${esc(item.u)}" rel="noopener nofollow" target="_blank">${esc(t(locale, 'repository'))}</a>`);
  if (item.hp) links.push(`<a href="${esc(item.hp)}" rel="noopener nofollow" target="_blank">${esc(t(locale, 'homepage'))}</a>`);
  if (item.o) links.push(`<a href="${pre}/author/${encodeURIComponent(item.o)}/">${esc(t(locale, 'owner'))}: ${esc(item.o)}</a>`);

  const relatedHtml = related?.length
    ? `<h2>${esc(t(locale, 'related'))}</h2><div class="grid">${related.map((r) => listingCard(r, locale)).join('')}</div>`
    : '';

  const machineNote =
    machine && locale !== 'en' && locale !== 'zh'
      ? `<p style="color:var(--muted);font-size:.85rem;">${esc(t(locale, 'unTranslated'))}</p>`
      : '';

  return `<article class="prose">
<h1>${esc(item.n)}</h1>
<p class="lead">${esc(text)}</p>
${machineNote}
<div class="meta">${kindPill}${stars}${dls}${ver}${lic}${riskPill}</div>
${tags}${caps}
${install}
<table class="kv">
  <tr><th>${esc(t(locale, 'category'))}</th><td><a href="${pre}/category/${esc(item.c)}/">${esc(catTitle(item.c, locale))}</a></td></tr>
  ${item.o ? `<tr><th>${esc(t(locale, 'owner'))}</th><td><a href="${pre}/author/${encodeURIComponent(item.o)}/">${esc(item.o)}</a></td></tr>` : ''}
  ${item.v ? `<tr><th>${esc(t(locale, 'version'))}</th><td>${esc(item.v)}</td></tr>` : ''}
  ${item.st ? `<tr><th>${esc(t(locale, 'stars'))}</th><td>${item.st}</td></tr>` : ''}
  ${item.dl ? `<tr><th>${esc(t(locale, 'downloadStats'))}</th><td>${item.dl}</td></tr>` : ''}
  ${item.lc ? `<tr><th>${esc(t(locale, 'license'))}</th><td>${esc(item.lc)}</td></tr>` : ''}
  ${item.eng ? `<tr><th>${esc(t(locale, 'dshCompat'))}</th><td><code>${esc(item.eng)}</code></td></tr>` : ''}
  ${item.ad ? `<tr><th>${esc(t(locale, 'added'))}</th><td>${esc(item.ad)}</td></tr>` : ''}
  ${links.length ? `<tr><th>Links</th><td>${links.join(' · ')}</td></tr>` : ''}
</table>
${redlines}${adv}${shots}
</article>
${relatedHtml}`;
}

/** Facet blocks reused on listing pages. */
export function facetsBody({ locale }) {
  const pre = prefix(locale);
  const kinds = kindFacets()
    .map((k) => `<a class="pill" href="${pre}/type/${k.id}/">${esc(k.title)} <span style="color:var(--muted)">${k.count}</span></a>`)
    .join(' ');
  const caps = navCapabilities
    .slice(0, 16)
    .map((c) => `<a class="pill" href="${pre}/capability/${c.slug}/">${esc(c.slug)} <span style="color:var(--muted)">${c.count}</span></a>`)
    .join(' ');
  return `<h3>${esc(t(locale, 'categories'))}</h3><div class="meta">${kinds}</div>
<h3>Capabilities</h3><div class="meta">${caps}</div>
<h3>${esc(t(locale, 'security'))}</h3><div class="meta">
  <a class="pill" href="${pre}/security/#risk-none">${esc(t(locale, 'riskNone'))} ${SECURITY_STATS.none}</a>
  <a class="pill" href="${pre}/security/#risk-low">${esc(t(locale, 'riskLow'))} ${SECURITY_STATS.low}</a>
  <a class="pill" href="${pre}/security/#risk-medium">${esc(t(locale, 'riskMedium'))} ${SECURITY_STATS.medium}</a>
  <a class="pill" href="${pre}/security/#risk-high">${esc(t(locale, 'riskHigh'))} ${SECURITY_STATS.high}</a>
</div>`;
}

export {
  ITEMS, PLUGINS, ECOSYSTEM, categoryFacets, kindFacets, navTags, navCapabilities,
  bucketItems, relatedItems, applyFilters, sortSlugs, paginate, getItem, tagTitle,
  SECURITY_STATS, indexableTags, indexableOwners,
};
