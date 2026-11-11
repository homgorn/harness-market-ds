#!/usr/bin/env node
/**
 * Machine-translate plugin descriptions for the locales that have no source
 * translations (ru, es, de, fr, ja). Chinese comes from the upstream registry
 * and is never translated.
 *
 * Provider: the public MyMemory API (no key). The Google web endpoint was
 * rate-limited to 429 after ~1,500 requests, so the provider is configurable
 * and MyMemory is the default.
 *
 * Behaviour:
 *   - translates the most-downloaded plugins first (traffic order),
 *   - caps how many it translates per locale (TOP_N),
 *   - caches every result on disk, so a re-run resumes and costs nothing.
 *
 * Machine translations are labelled as such in the UI. They are never
 * presented as verified source translations.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA = path.join(ROOT, 'data');
const CACHE_DIR = path.join(DATA, 'i18n-cache');
const TARGETS = ['ru', 'es', 'de', 'fr', 'ja'];
const CONCURRENCY = Number(process.env.TRANSLATE_CONCURRENCY || 3);
const TOP_N = Number(process.env.TOP_N || 2500);
const GAP_MS = Number(process.env.GAP_MS || 350);
const PROVIDER = process.env.TRANSLATE_PROVIDER || 'mymemory';

fs.mkdirSync(CACHE_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cachePath = (slug, lang) => path.join(CACHE_DIR, `${lang}__${slug.replace(/[^a-zA-Z0-9._-]/g, '_')}.json`);

async function translateMyMemory(text, lang) {
  const url =
    'https://api.mymemory.translated.net/get?q=' +
    encodeURIComponent(text) +
    '&langpair=en%7C' + lang;
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const out = data?.responseData?.translatedText;
  if (!out || /MYMEMORY WARNING|QUERY LENGTH LIMIT/i.test(out)) throw new Error('no translation');
  return out;
}

async function translateGoogle(text, lang) {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + lang + '&dt=t&q=' + encodeURIComponent(text);
  const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data[0] || []).map((seg) => seg[0]).join('');
}

const TRANSLATORS = { mymemory: translateMyMemory, google: translateGoogle };

async function translateOne(item, lang) {
  const cp = cachePath(item.s, lang);
  if (fs.existsSync(cp)) {
    try {
      return JSON.parse(fs.readFileSync(cp, 'utf8')).t;
    } catch {
      /* refetch */
    }
  }
  const text = (item.de || '').slice(0, 500);
  if (!text) return '';
  const fn = TRANSLATORS[PROVIDER] || translateMyMemory;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const t = await fn(text, lang);
      if (!t) throw new Error('empty');
      fs.writeFileSync(cp, JSON.stringify({ t, src: text, lang, by: PROVIDER }));
      return t;
    } catch (e) {
      await sleep(1200 * (attempt + 1) ** 2);
    }
  }
  return '';
}

async function main() {
  const site = JSON.parse(fs.readFileSync(path.join(DATA, 'site.json'), 'utf8'));
  const ranked = [...site.plugins].sort((a, b) => b.dl - a.dl || b.st - a.st);
  const items = ranked.slice(0, TOP_N);
  console.log('provider:', PROVIDER, '| plugins considered:', items.length);

  const out = {};
  for (const lang of TARGETS) {
    const file = path.join(DATA, `i18n-${lang}.json`);
    out[lang] = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  }

  let ok = 0;
  let fail = 0;
  const queue = [];
  for (const it of items) {
    for (const lang of TARGETS) if (!out[lang][it.s]) queue.push({ it, lang });
  }
  console.log('to translate:', queue.length);

  async function worker() {
    while (queue.length) {
      const { it, lang } = queue.shift();
      const t = await translateOne(it, lang);
      if (t) {
        out[lang][it.s] = t;
        ok++;
      } else {
        fail++;
      }
      await sleep(GAP_MS);
      if ((ok + fail) % 100 === 0) {
        console.log(`  ${ok + fail}/${queue.length + ok + fail} (ok ${ok}, fail ${fail})`);
        for (const lang of TARGETS) fs.writeFileSync(path.join(DATA, `i18n-${lang}.json`), JSON.stringify(out[lang]));
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  for (const lang of TARGETS) {
    fs.writeFileSync(path.join(DATA, `i18n-${lang}.json`), JSON.stringify(out[lang]));
    console.log(`${lang}: ${Object.keys(out[lang]).length} translations`);
  }
  console.log('done. ok', ok, 'fail', fail);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
