import catalog from '../../data/catalog.json';

export type Plugin = any;

export const plugins: Plugin[] = (catalog as any).plugins || [];
export const categories = (catalog as any).metadata?.categories || {};

export function getPlugin(slug: string) {
  return plugins.find((p) => slugOf(p) === slug);
}

export function pluginsByCategory(cat: string) {
  return plugins.filter((p) => p.metadata?.category === cat);
}

export function allCategories() {
  return Object.entries(categories).map(([slug, info]: any) => ({
    slug,
    title: info?.title || { en: slug },
  }));
}

export function slugify(name: string) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const __slugSeen = new Map();
const __uniqueSlugMap = new Map();
for (const p of plugins) {
  if (p.slug) { __uniqueSlugMap.set(p, p.slug); continue; }
  const base = slugify(p.name);
  let slug = base;
  let i = 2;
  while (__slugSeen.has(slug)) slug = `${base}-${i++}`;
  __slugSeen.set(slug, true);
  __uniqueSlugMap.set(p, slug);
}
export function slugOf(p: any) {
  return p.slug || __uniqueSlugMap.get(p) || slugify(p.name);
}
