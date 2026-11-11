import fs from 'node:fs';
import path from 'node:path';
const files=[];function w(d){for(const f of fs.readdirSync(d)){const x=path.join(d,f);const s=fs.statSync(x);if(s.isDirectory())w(x);else if(f.endsWith('.html'))files.push(x);}}w('dist');
let badTitle=0,badDesc=0,noCanon=0,noOg=0,noJL=0,noHL=0;
const N=Math.min(3000,files.length);
for(let i=0;i<N;i++){
  const html=fs.readFileSync(files[i],'utf8');
  const m=html.match(/<title>([^<]*)<\/title>/);
  const title=m?m[1]:'';
  const m2=html.match(/<meta name="description" content="([^"]*)"/);
  const desc=m2?m2[1]:'';
  if(!title||title.length>60)badTitle++;
  if(desc.length<120||desc.length>160)badDesc++;
  if(!html.includes('rel="canonical"'))noCanon++;
  if(!html.includes('property="og:title"'))noOg++;
  if(!html.includes('application/ld+json'))noJL++;
  if(!html.includes('hreflang='))noHL++;
}
console.log('sample',N,'badTitle',badTitle,'badDesc',badDesc,'noCanon',noCanon,'noOg',noOg,'noJL',noJL,'noHL',noHL);
