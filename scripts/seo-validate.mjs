import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'dist';
const files = [];
function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (f.endsWith('.html')) files.push(p);
  }
}
walk(ROOT);

let badTitle=0, badDesc=0, noCanonical=0, noOg=0, noJsonLd=0, noHreflang=0;
const sample=[];
for (const f of files) {
  const html = fs.readFileSync(f,'utf8');
  const title = (html.match(/<title>([^<]*)<\/title>/)||[])[1] || '';
  const desc = (html.match(/<meta name="description" content="([^"]*)"/)||[])[1] || '';
  const canonical = html.includes('rel="canonical"');
  const og = html.includes('property="og:title"');
  const jsonld = html.includes('application/ld+json');
  const hreflang = html.includes('hreflang=');
  if (title.length===0 || title.length>60) badTitle++;
  if (desc.length<120 || desc.length>160) badDesc++;
  if (!canonical) noCanonical++;
  if (!og) noOg++;
  if (!jsonld) noJsonLd++;
  if (!hreflang) noHreflang++;
  if (sample.length<3) sample.push({f,titleLen:title.length,descLen:desc.length});
}
console.log('Total HTML files:', files.length);
console.log('Bad title (0 or >60):', badTitle);
console.log('Bad desc (<120 or >160):', badDesc);
console.log('Missing canonical:', noCanonical);
console.log('Missing og:title:', noOg);
console.log('Missing json-ld:', noJsonLd);
console.log('Missing hreflang:', noHreflang);
console.log('Sample:', sample);
