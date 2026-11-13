import type { APIRoute } from 'astro';
// Open to crawlers on the real domain only. beta and local previews stay blocked.
export const GET: APIRoute = ({ url }) => {
  const live = ['localbuzzatx.com', 'www.localbuzzatx.com'].includes(url.hostname);
  const body = live
    ? `User-agent: *\nAllow: /\nDisallow: /status\nDisallow: /*-preview\n\nSitemap: https://localbuzzatx.com/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
