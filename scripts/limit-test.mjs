import fs from 'node:fs';
fs.rmSync('C:/limtest', { recursive: true, force: true });
fs.mkdirSync('C:/limtest/assets', { recursive: true });
for (let i = 0; i < 21000; i++) fs.writeFileSync(`C:/limtest/assets/f${i}.txt`, 'x');
fs.writeFileSync(
  'C:/limtest/wrangler.jsonc',
  JSON.stringify(
    { name: 'limtest-hmd', main: 'worker.js', compatibility_date: '2026-11-10', assets: { directory: './assets' } },
    null,
    2
  )
);
fs.writeFileSync('C:/limtest/worker.js', 'export default { async fetch(){ return new Response("ok"); } };\n');
console.log('created 21000 asset files');
