import fs from 'node:fs';
const c = JSON.parse(fs.readFileSync('data/catalog.json','utf8'));
const p = c.plugins;
const withSort = p.filter(x=>x.metadata && x.metadata.sortKeys && Object.keys(x.metadata.sortKeys).length);
console.log('plugins', p.length, 'with non-empty sortKeys', withSort.length);
if (withSort.length) console.log(JSON.stringify(withSort.slice(0,3), null, 2).slice(0,1500));
// engines presence
const withEng = p.filter(x=>x.versions?.[0]?.engines && Object.keys(x.versions[0].engines).length);
console.log('with engines', withEng.length);
if (withEng.length) console.log(JSON.stringify(withEng.slice(0,2).map(x=>({name:x.name, engines:x.versions[0].engines})), null, 2));
// homepage/repo coverage
console.log('with homepage', p.filter(x=>x.homepage).length, 'with repo', p.filter(x=>x.repository?.url).length);
// desc languages
const langs = new Set();
for (const x of p) for (const k of Object.keys(x.description||{})) langs.add(k);
console.log('desc langs', [...langs]);
// title keys
const tl = new Set(); for (const x of p) for (const k of Object.keys(x.title||{})) tl.add(k);
console.log('title langs', [...tl]);
// version source variety
const src = new Set(); for (const x of p) for (const v of x.versions||[]) src.add(v.source?.type);
console.log('version sources', [...src]);
// version counts
console.log('sample version entry', JSON.stringify(p[0].versions));
