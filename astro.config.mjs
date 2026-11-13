import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  redirects: {
    '/opinion': '/omg',
    '/morning-buzz': '/weekly-buzz',
    '/events': '/to-do',
    '/neighborhoods': '/news?tag=Neighborhoods',
    '/government': '/news?tag=Government',
    '/development': '/news?tag=Development',
    '/business': '/news?tag=Business',
  },
  adapter: cloudflare(),
});
