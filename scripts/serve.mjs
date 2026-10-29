import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('rendered');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
createServer(async (request, response) => {
  try {
    let path = resolve(root, `.${decodeURIComponent(new URL(request.url, 'http://localhost').pathname)}`);
    if (path !== root && !path.startsWith(root + sep)) throw new Error('Invalid path');
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
    response.end(await readFile(path));
  } catch {
    response.writeHead(404); response.end('Not found');
  }
}).listen(4173, '127.0.0.1', () => console.log('KB preview: http://127.0.0.1:4173/kb/incidents/4471-review'));
