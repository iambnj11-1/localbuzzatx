import type { APIRoute } from 'astro';
import { posts, authors } from '../lib/posts';
const pages = ['/', '/news', '/watch', '/omg', '/money', '/to-do', '/shout-out', '/morning-buzz', '/how-it-works', '/sources', '/advertise', '/contact', '/about', '/privacy', '/terms', '/affiliate-disclosure', '/blog', '/guides', '/blog/caleb', '/blog/tori'];
export const GET: APIRoute = () => {
  const base = 'https://localbuzzatx.com';
  const urls = [
    ...pages.map((p) => ({ loc: base + p })),
    ...posts.filter((x) => !x.draft).map((x) => ({ loc: `${base}${authors[x.author].path}/${x.slug}`, lastmod: x.date })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${u.loc}</loc>${'lastmod' in u && u.lastmod ? `<lastmod>${String(u.lastmod).slice(0, 10)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'content-type': 'application/xml; charset=utf-8' } });
};
