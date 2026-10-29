import { build } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

await build();
const template = await readFile('rendered/index.html', 'utf8');
await build({ build: { ssr: 'src/server.js', outDir: '.ssr', emptyOutDir: true } });
{
  const { renderPages } = await import('../.ssr/server.js');
  const pages = await renderPages();
  const manifest = [];
  for (const page of pages) {
    const directory = resolve('rendered', `.${page.route}`);
    await mkdir(directory, { recursive: true });
    const html = template.replace('</head>', `${page.head}</head>`)
      .replace('<div id="app"></div>', `<div id="app">${page.body}</div>`);
    await writeFile(`${directory}/index.html`, html);
    manifest.push({ route: page.route, ...page.metadata });
  }
  const home = await readFile('rendered/kb/index.html', 'utf8');
  await writeFile('rendered/index.html', home);
  await writeFile('rendered/build-manifest.json', JSON.stringify({ generatedAt: new Date().toISOString(), pages: manifest }, null, 2));
  console.log(`Rendered ${pages.length} pages from the actual Svelte components.`);
}
