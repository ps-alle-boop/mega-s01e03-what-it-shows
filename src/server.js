import { render } from 'svelte/server';
const pages = import.meta.glob('/src/routes/kb/**/+page.svx', { eager: true });
export async function renderPages() {
  const result = [];
  for (const [path, page] of Object.entries(pages)) {
    const html = await render(page.default);
    result.push({ route: path.replace('/src/routes', '').replace('/+page.svx', ''),
      metadata: page.metadata, head: html.head, body: html.body });
  }
  return result;
}
