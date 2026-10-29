import { defineConfig } from 'vite';
import { compile, preprocess } from 'svelte/compiler';
import { mdsvex } from 'mdsvex';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const markdown = mdsvex({
  extensions: ['.svx'],
  layout: { runbook: `${root}src/lib/layouts/runbook.svelte` },
});

export default defineConfig({
  root,
  resolve: { alias: { '#lib': `${root}src/lib` } },
  plugins: [{
    name: 'support-kb-svelte',
    enforce: 'pre',
    async transform(source, id, options) {
      if (!/\.(svelte|svx)$/.test(id)) return null;
      const prepared = id.endsWith('.svx')
        ? await preprocess(source, markdown, { filename: id })
        : { code: source };
      const compiled = compile(prepared.code, {
        filename: id,
        generate: options?.ssr ? 'server' : 'client',
        css: 'injected',
        dev: false,
      });
      return { code: compiled.js.code, map: compiled.js.map };
    },
  }],
  build: { outDir: 'rendered', emptyOutDir: true },
});
