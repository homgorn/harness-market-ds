/**
 * Localized descriptions.
 *
 * The upstream registry publishes English and Chinese only. The other locales
 * use a machine translation produced by scripts/translate-descriptions.mjs and
 * are labelled as such in the UI — a machine translation is never presented as
 * a verified source translation.
 */
import cat from '../../data/catalog.ssr.json' with { type: 'json' };
import ru from '../../data/i18n-ru.json' with { type: 'json' };
import es from '../../data/i18n-es.json' with { type: 'json' };
import de from '../../data/i18n-de.json' with { type: 'json' };
import fr from '../../data/i18n-fr.json' with { type: 'json' };
import ja from '../../data/i18n-ja.json' with { type: 'json' };

const MAPS = { ru, es, de, fr, ja };

/** Locales whose description comes from a machine translation. */
export const MACHINE_LOCALES = new Set(Object.keys(MAPS));

/**
 * Description for an item in a locale.
 * @returns {{text: string, machine: boolean}}
 */
export function descFor(item, locale) {
  if (locale === 'en') return { text: item.de || '', machine: false };
  if (locale === 'zh') return { text: item.dz || item.de || '', machine: false };
  const map = MAPS[locale];
  const translated = map && map[item.s];
  if (translated) return { text: translated, machine: true };
  return { text: item.de || '', machine: true };
}

/** True when a locale has a real (non-machine) description for this item. */
export function hasNativeDescription(item, locale) {
  if (locale === 'en') return true;
  if (locale === 'zh') return !!(item.dz && item.dz.length);
  return false;
}

/** How many descriptions each locale has translated, and of how many. */
export const TRANSLATION_COVERAGE = (() => {
  const total = cat.counts.plugins;
  const out = { en: { translated: total, total }, zh: { translated: total, total } };
  for (const [lang, map] of Object.entries(MAPS)) {
    out[lang] = { translated: Object.keys(map).length, total };
  }
  return out;
})();
