import { copyFile, mkdir } from 'node:fs/promises';

// Emit entry points so direct links work on static hosts such as GitHub Pages.
const routes = [
  'get-started', 'login', 'home', 'settings', 'practice', 'progress', 'messages',
  'pricing', 'lessons', 'recipes', 'explore', 'faq', 'about', 'docs', 'privacy',
  'terms', 'preview/imessage', 'preview/phone',
];

await Promise.all(routes.map(async (route) => {
  await mkdir(`dist/${route}`, { recursive: true });
  await copyFile('dist/index.html', `dist/${route}/index.html`);
}));
await copyFile('dist/index.html', 'dist/404.html');
