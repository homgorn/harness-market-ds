import fs from 'node:fs';
const html=fs.readFileSync('dist/p/dsh-harness-zh-cn/index.html','utf8');
console.log('has ld+json:', html.includes('application/ld+json'));
const i=html.indexOf('application/ld+json');
console.log(html.slice(Math.max(0,i-30), i+120));
