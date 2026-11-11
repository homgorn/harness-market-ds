/**
 * URL scheme and path parsing.
 *
 *   /                       home (en)
 *   /<locale>/              home (other locales)
 *   /category/<cat>/        category listing   (+ /<n> for page n)
 *   /tag/<tag>/             tag listing        (+ /<n>)
 *   /type/<kind>/           artifact-type listing (+ /<n>)
 *   /capability/<cap>/      capability listing (+ /<n>)
 *   /author/<owner>/        author listing     (+ /<n>)
 *   /p/<slug>/              detail page
 *   /security/              security report
 *   /search/                search
 *   /about/ /privacy/ /terms/ /cookies/ /blog/ /changelog/
 */
export const PER_PAGE = 48;

export const LOCALES = ['en', 'ru', 'zh', 'es', 'de', 'fr', 'ja'];

export const LISTING_TYPES = ['category', 'tag', 'type', 'capability', 'author'];

export const STATIC_PAGES = ['about', 'privacy', 'terms', 'cookies', 'blog', 'changelog', 'faq', 'docs'];

/**
 * @param {string} pathname
 * @returns {{locale: string, type: string, value?: string, page: number}}
 */
export function resolve(pathname) {
  const parts = String(pathname || '')
    .split('/')
    .filter(Boolean);
  const locale = LOCALES.includes(parts[0]) ? parts[0] : 'en';
  const rest = LOCALES.includes(parts[0]) ? parts.slice(1) : parts;

  if (!rest.length) return { locale, type: 'home' };

  const [head, ...tail] = rest;

  if (head === 'p') {
    return tail[0] ? { locale, type: 'detail', value: decodeURIComponent(tail[0]) } : { locale, type: 'home' };
  }

  if (LISTING_TYPES.includes(head)) {
    const value = decodeURIComponent(tail[0] || '');
    const page = tail[1] ? parseInt(tail[1], 10) : 1;
    return { locale, type: head, value, page: Number.isFinite(page) && page > 0 ? page : 1 };
  }

  if (head === 'security' || head === 'search' || STATIC_PAGES.includes(head)) {
    return { locale, type: head };
  }

  return { locale, type: 'home' };
}

/** Build a canonical path for a route (locale-aware, no trailing page). */
export function pathFor(locale, type, value, page = 1) {
  const pre = locale === 'en' ? '' : `/${locale}`;
  if (type === 'home') return `${pre}/`;
  if (type === 'detail') return `${pre}/p/${encodeURIComponent(value)}/`;
  if (LISTING_TYPES.includes(type)) {
    const base = `${pre}/${type}/${encodeURIComponent(value)}/`;
    return page > 1 ? `${base}${page}/` : base;
  }
  return `${pre}/${type}/`;
}
