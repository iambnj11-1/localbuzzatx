import { XMLParser } from 'fast-xml-parser';
import { getDb, readStories, saveStories, runInBackground } from './store';

export type Story = {
  source: string;
  area?: string;
  category: string;
  title: string;
  link: string;
  summary: string;
  videoId?: string;
  image?: string;
  date: Date;
};

// Add or remove outlets here. Only the headline, a short blurb and a link back are used.
export const FEEDS = [
  { source: 'KXAN', category: 'News', url: 'https://www.kxan.com/feed/' },
  { source: 'Spectrum News Austin', category: 'News', url: 'https://spectrumlocalnews.com/services/contentfeed.tx%7Caustin%7Cnews.landing.rss' },
  { source: 'West Austin News', category: 'Neighborhoods', url: 'https://westaustinnews.com/feed/' },
  { source: 'Austonia', category: 'Business', url: 'https://austonia.com/feeds/feed.rss', alts: ['https://austonia.com/feed', 'https://austonia.com/rss', 'https://austonia.com/rss.xml', 'https://austonia.com/feed.xml'] },
  { source: 'Austin Monitor', category: 'Government', url: 'https://www.austinmonitor.com/feed/' },
  // Business and Tech. Addresses unverified; check /status.
  { source: 'Silicon Hills News', category: 'Tech', url: 'https://siliconhillsnews.com/feed/' },
  { source: 'TOWERS', category: 'Development', url: 'https://austin.towers.net/feed' },
  { source: '365 Things Austin', category: 'Events', url: 'https://365thingsaustin.com/feed' },
  { source: 'Austin Monthly', category: 'Events', url: 'https://austinmonthly.com/feed' },
  // Video: YouTube channel feeds (embedded with YouTube's own player). The KVUE channel id is unverified; check /status.
  { source: 'KVUE', category: 'Watch', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxXTyFekH99JnS3qaXIQW7A', alts: ['https://www.youtube.com/feeds/videos.xml?playlist_id=UUxXTyFekH99JnS3qaXIQW7A'] },
];

// City stories that are really about a neighborhood or a local park/landmark get the Neighborhoods tag.
const NEIGHBORHOOD_WORDS = /(millennium|zilker|east austin|east riverside|south congress|south austin|north austin|hyde park|mueller|barton springs|neighborhood|park\b|erosion|pflugerville|manor|del valle|st\. johns|montopolis|rainey|bouldin)/i;

const parser = new XMLParser({ ignoreAttributes: false, processEntities: true });

const clean = (value: unknown, max = 200): string => {
  const text = String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? text.slice(0, max).replace(/\s+\S*$/, '') + '…' : text;
};

const arr = (v: any): any[] => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);
const pickImage = (it: any, videoId?: string): string | undefined => {
  if (videoId) return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const cands: string[] = [];
  for (const k of ['media:content', 'media:thumbnail', 'enclosure']) {
    for (const m of arr(it[k])) {
      const u = m?.['@_url'];
      const t = String(m?.['@_type'] ?? m?.['@_medium'] ?? 'image');
      if (u && /image/i.test(t)) cands.push(u);
    }
  }
  for (const k of ['content:encoded', 'description', 'content', 'summary']) {
    const h = text(it[k]);
    const m = h.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (m) cands.push(m[1].replace(/&amp;/g, '&'));
  }
  return cands.find((u) => /^https:\/\//.test(u));
};

const text = (v: any): string => (typeof v === 'object' && v !== null ? String(v['#text'] ?? '') : String(v ?? ''));

async function loadFeed(feed: (typeof FEEDS)[number]): Promise<Story[]> {
  // Try the main address, then any backup addresses, until one returns stories.
  const alts: string[] = (feed as any).alts ?? [];
  for (const url of [feed.url, ...alts]) {
    const out = await loadOne({ ...feed, url });
    if (out.length) return out;
  }
  return [];
}

async function loadOne(feed: (typeof FEEDS)[number]): Promise<Story[]> {
  const started = Date.now();
  let status = 'error';
  const record = (count: number, note?: string) => lastReport.push({ note, source: feed.source, area: (feed as any).area, url: feed.url, status, count, ms: Date.now() - started });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'LocalBuzzATX/1.0 (+headline aggregator, links back to source)' },
    });
    status = String(res.status);
    if (!res.ok) { record(0); return []; }
    const body = await res.text();
    const xml = parser.parse(body);
    const rawItems = xml?.rss?.channel?.item ?? xml?.feed?.entry ?? [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    const out = items
      .map((it: any): Story | null => {
        const title = clean(text(it.title), 160);
        const link = typeof it.link === 'string' ? it.link : it.link?.['@_href'] ?? text(it.guid);
        const date = new Date(text(it.pubDate ?? it.published ?? it.updated));
        if (!title || !link || !/^https?:/.test(link)) return null;
        return {
          source: feed.source,
          area: (feed as any).area,
          category: feed.category,
          title,
          link,
          summary: clean(text(it.description ?? it.summary ?? it['media:group']?.['media:description'])),
          videoId: it['yt:videoId'] ? String(it['yt:videoId']) : undefined,
          image: pickImage(it, it['yt:videoId'] ? String(it['yt:videoId']) : undefined),
          date: isNaN(date.getTime()) ? new Date(0) : date,
        };
      })
      .filter((s): s is Story => s !== null)
      .slice(0, 15);
    record(out.length, out.length ? undefined : `${res.headers.get('content-type') ?? ''} | ${body.slice(0, 120).replace(/\s+/g, ' ')}`);
    return out;
  } catch (e) {
    status = e instanceof Error ? e.name : 'error';
    record(0);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export type FeedReport = { source: string; area?: string; url: string; status: string; count: number; ms: number; note?: string };
export let lastReport: FeedReport[] = [];

const lastGood = new Map<string, Story[]>();
let cache: { at: number; value: { stories: Story[]; sources: string[] } } | null = null;
const TTL_MS = 10 * 60 * 1000;

// Pictures we never want to show (generic graphics, logos). Add a pattern to hide one.
const BAD_IMAGE_TITLES = [/best and worst of austin/i];
const BAD_IMAGE_URLS = [/logo/i, /placeholder/i, /gravatar/i, /default[-_]/i, /blank/i];
const ogCache = new Map<string, string | null>();

async function ogImage(link: string): Promise<string | null> {
  if (ogCache.has(link)) return ogCache.get(link) ?? null;
  if (ogCache.size > 300) ogCache.clear();
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 4000);
  try {
    const r = await fetch(link, { signal: c.signal, headers: { 'User-Agent': 'LocalBuzzATX/1.0 (+headline aggregator, links back to source)' } });
    if (!r.ok) { ogCache.set(link, null); return null; }
    const html = (await r.text()).slice(0, 80000);
    const m = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    const u = m ? m[1].replace(/&amp;/g, '&') : null;
    const ok = u && /^https:\/\//.test(u) ? u : null;
    ogCache.set(link, ok);
    return ok;
  } catch {
    ogCache.set(link, null);
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function fillImages(stories: Story[]) {
  const missing = stories.filter((s) => !s.image && s.category !== 'Watch' && !ogCache.has(s.link)).slice(0, 12);
  await Promise.all(missing.map(async (s) => { const u = await ogImage(s.link); if (u) s.image = u; }));
  for (const s of stories) {
    if (!s.image && ogCache.get(s.link)) s.image = ogCache.get(s.link) ?? undefined;
    if (s.image && (BAD_IMAGE_TITLES.some((r) => r.test(s.title)) || BAD_IMAGE_URLS.some((r) => r.test(s.image!)))) s.image = undefined;
  }
}

function mockStories(): Story[] {
  const mk = (i: number, source: string, category: string, title: string, image?: string): Story => ({ source, category, title, link: `https://example.com/${i}`, summary: `Sample summary for story ${i}. It has a couple of sentences so the layout is realistic.`, image, date: new Date(Date.now() - i * 3600000) });
  const img = (n: number) => `https://picsum.photos/seed/lba${n}/800/500`;
  return [
    mk(1, 'KXAN', 'News', 'Mock lead story about the city', img(1)), mk(2, 'KXAN', 'News', 'Mock second story', img(2)), mk(3, 'Austin Monitor', 'Government', 'Mock council vote', img(3)),
    mk(4, 'TOWERS', 'Development', 'Mock tower plan', img(4)), mk(5, 'Austin Monthly', 'Events', 'Mock weekend ideas', img(5)), mk(6, 'Silicon Hills News', 'Tech', 'Mock startup news', img(6)),
    mk(7, 'KXAN', 'News', 'Mock fourth story', img(7)), mk(8, 'Austin Monitor', 'Government', 'Mock budget item', img(8)), mk(9, 'TOWERS', 'Development', 'Mock penthouse'),
  ];
}

let refreshing: Promise<unknown> | null = null;

export async function getStories(force = false): Promise<{ stories: Story[]; sources: string[] }> {
  if (typeof process !== 'undefined' && process.env?.LBA_MOCK) return { stories: mockStories(), sources: ['KXAN'] };
  // With the database connected: show saved stories right away, and refresh from the feeds in the background when they're over 10 minutes old.
  if (!force && getDb()) {
    try {
      const saved = await readStories();
      if (saved) {
        const stale = Date.now() - saved.newest > TTL_MS;
        if (saved.stories.length === 0) {
          const live = await fetchLive(true);
          await saveStories(live.stories).catch(() => {});
          return live;
        }
        if (stale && !refreshing) {
          refreshing = fetchLive(true).then((v) => saveStories(v.stories)).catch(() => {}).finally(() => { refreshing = null; });
          runInBackground(refreshing);
        }
        return { stories: saved.stories, sources: [...new Set(saved.stories.map((s) => s.source))] };
      }
    } catch { /* database trouble: fall through to live feeds */ }
  }
  const out = await fetchLive(force);
  if (getDb()) runInBackground(saveStories(out.stories).catch(() => {}));
  return out;
}

async function fetchLive(force = false): Promise<{ stories: Story[]; sources: string[] }> {
  if (!force && cache && Date.now() - cache.at < TTL_MS) return cache.value;
  lastReport = [];
  // Optional private feed address kept in a Cloudflare secret (not in the public code).
  const techUrl = typeof process !== 'undefined' ? process.env?.ABJ_TECH_FEED : undefined;
  const bizUrl = typeof process !== 'undefined' ? process.env?.ABJ_BUSINESS_FEED : undefined;
  const feedList = [...FEEDS, ...(techUrl ? [{ source: 'Austin Business Journal', category: 'Tech', url: techUrl }] : []), ...(bizUrl ? [{ source: 'Austin Business Journal', category: 'Business', url: bizUrl }] : [])];
  const fresh = await Promise.all(feedList.map(loadFeed));
  // If a feed fails or comes back empty this time, keep showing its last good stories instead of leaving a hole.
  const results = fresh.map((r, i) => {
    const key = `${feedList[i].source}|${feedList[i].url}`;
    if (r.length > 0) { lastGood.set(key, r); return r; }
    return lastGood.get(key) ?? [];
  });
  const seen = new Set<string>();
  const stories = results
    .flat()
    .filter((s) => {
      const key = s.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((s) => (s.source === 'Austin Monitor' && NEIGHBORHOOD_WORDS.test(s.title) ? { ...s, category: 'Neighborhoods' } : s));
  await fillImages(stories);
  const sources = [...new Set(feedList.filter((_, i) => results[i].length > 0).map((f) => f.source))];
  const value = { stories, sources };
  if (stories.length > 0) cache = { at: Date.now(), value };
  return value;
}
