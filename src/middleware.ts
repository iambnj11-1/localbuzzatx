import { defineMiddleware } from 'astro:middleware';
import { setRuntime } from './lib/store';

// Hands the Cloudflare database and background-task hook to the story loader for this request.
export const onRequest = defineMiddleware((context, next) => {
  setRuntime((context.locals as any).runtime);
  return next();
});
