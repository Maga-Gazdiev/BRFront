// Production nginx resolves SSI against Go for up-to-date CMS metadata.
import { readFile, writeFile } from 'node:fs/promises';
const path = new URL('../dist/index.html', import.meta.url);
let html = await readFile(path, 'utf8');
html = html
  .replace(/<title>[\s\S]*?<\/title>/g, '')
  .replace(/<meta\s+(?:name="description"|property="og:[^"]+")[^>]*>/g, '');
html = html.replace('</head>', '<!--# include virtual="/api/meta" -->\n</head>');
await writeFile(path, html);
