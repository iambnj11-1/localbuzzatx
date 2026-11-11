import { XMLParser } from 'fast-xml-parser';
import { getDb, getEnv, readStories, saveStories, runInBackground } from './store';
import { enrich } from './ai';

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
  origTitle?: string; // the outlet's own headline when `title` is the AI-shortened one
  why?: string; // saved AI line: why it matters to people in Austin
  crime?: boolean; // saved AI flag (undefined = not tagged yet)
  money?: boolean;
  impact?: number; // saved AI rating 1-5: how much it touches daily life in Austin
  approxDate?: boolean; // date is when we first saw it, not the outlet's own timestamp
};

// Add or remove outlets here. Only the headline, a short blurb and a link back are used.
export const FEEDS = [
  { source: 'KXAN', category: 'News', url: 'https://www.kxan.com/feed/' },
  { source: 'Spectrum News Austin', category: 'News', url: 'https://spectrumlocalnews.com/services/contentfeed.tx%7Caustin%7Cnews.landing.rss' },
  { source: 'West Austin News', category: 'Neighborhoods', url: 'https://westaustinnews.com/feed/' },
  // Crime and courts. These only feed the Busted tab under News (not the homepage). Addresses unverified; check /status.
  { source: 'KXAN', area: 'Crime', category: 'Busted', url: 'https://www.kxan.com/news/crime/feed/', alts: ['https://www.kxan.com/news/crime/feed', 'https://www.kxan.com/news/local/crime/feed/'] },
  { source: 'Austin Monitor', category: 'Government', url: 'https://www.austinmonitor.com/feed/' },
  // Business and Tech. Addresses unverified; check /status.
  { source: 'Silicon Hills News', category: 'Tech', url: 'https://siliconhillsnews.com/feed/' },
  { source: 'TOWERS', category: 'Development', url: 'https://austin.towers.net/feed' },
  { source: '365 Things Austin', category: 'Events', url: 'https://365thingsaustin.com/feed' },
  { source: 'Austin Monthly', category: 'Events', url: 'https://austinmonthly.com/feed' },
  // Video: YouTube channel feeds (embedded with YouTube's own player). The KVUE channel id is unverified; check /status.
  // National and Texas news that can touch daily life. Shown in their own strip, never mixed into the Austin lists. Addresses unverified; check /status.
  { source: 'NPR', category: 'National', url: 'https://feeds.npr.org/1001/rss.xml' },
  { source: 'Texas Tribune', category: 'National', area: 'Texas', url: 'https://www.texastribune.org/feeds/main/' },
  { source: 'KVUE', category: 'Watch', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxXTyFekH99JnS3qaXIQW7A', alts: ['https://www.youtube.com/feeds/videos.xml?playlist_id=UUxXTyFekH99JnS3qaXIQW7A'] },
];

// Outlets with no feed. The site reads their public news listing page and picks out headline links.
// `link` matches article addresses; police items from the City go to the Crime tab.
export const PAGES = [
  { source: 'City of Austin', category: 'Government', page: true, url: 'https://www.austintexas.gov/news', base: 'https://www.austintexas.gov', link: /^\/[a-z0-9-]+\/news\/[a-z0-9-]{12,}$/ },
  { source: 'Community Impact', category: 'Neighborhoods', page: true, url: 'https://communityimpact.com/austin/', alts: ['https://communityimpact.com/central-austin/'], base: 'https://communityimpact.com', link: /^\/(austin|[a-z-]*austin|round-rock|cedar-park-leander|georgetown|lake-travis-westlake|pflugerville-hutto|san-marcos-buda-kyle|bastrop-cedar-creek|leander-liberty-hill|dripping-springs)\/(?!sponsored)[a-z-]+\/(\d{4}\/\d{2}\/\d{2}\/)?[a-z0-9-]{20,}\/?$/ },
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
  if ((feed as any).page) {
    for (const url of [feed.url, ...((feed as any).alts ?? [])]) {
      const out = await loadPage({ ...(feed as any), url });
      if (out.length) return out;
    }
    return [];
  }
  // Try the main address, then any backup addresses, until one returns stories.
  const alts: string[] = (feed as any).alts ?? [];
  // YouTube's public feed often refuses requests from servers. With a YOUTUBE_API_KEY secret set, use YouTube's official API instead.
  const channel = feed.url.match(/channel_id=(UC[\w-]+)/)?.[1];
  const ytKey = getEnv('YOUTUBE_API_KEY') ?? getEnv('Youtube_API_KEY');
  if (channel && ytKey) {
    const viaApi = await loadYouTube(feed, channel, ytKey);
    if (viaApi.length) return viaApi;
  }
  for (const url of [feed.url, ...alts]) {
    const out = await loadOne({ ...feed, url });
    if (out.length) return out;
  }
  return [];
}

const MONTHS = /(January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\.? \d{1,2},? \d{4}/;

async function loadPage(feed: { source: string; category: string; url: string; base: string; link: RegExp }): Promise<Story[]> {
  const started = Date.now();
  let status = 'error';
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 8000);
  try {
    const res = await fetch(feed.url, { signal: c.signal, headers: { 'User-Agent': 'LocalBuzzATX/1.0 (+headline aggregator, links back to source)', Accept: 'text/html' } });
    status = String(res.status);
    if (!res.ok) { lastReport.push({ source: `${feed.source} (page)`, url: feed.url, status, count: 0, ms: Date.now() - started }); return []; }
    const html = await res.text();
    const seen = new Set<string>();
    const out: Story[] = [];
    const re = /<a\b[^>]*href=["']([^"'#?]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) && out.length < 12) {
      let path = m[1];
      if (path.startsWith(feed.base)) path = path.slice(feed.base.length);
      if (!feed.link.test(path)) continue;
      // Cards can wrap an image, the headline, the author and the time. Prefer the heading; otherwise trim the byline.
      const hd = m[2].match(/<h\d[^>]*>([\s\S]*?)<\/h\d>/i);
      const title = clean(hd ? hd[1] : m[2], 220).replace(/\s+(?:By\s+)?[A-Z][\w.'’-]+(?:\s+[A-Z][\w.'’-]+){1,2}\s*·\s*\d+\s*(?:m|min|h|hr|hours?|d|days?)\s*ago.*$/i, '').replace(/\s+·\s+.*$/, '').trim().slice(0, 160);
      if (title.length < 25 || seen.has(path)) continue;
      seen.add(path);
      const near = html.slice(Math.max(0, m.index - 300), m.index + m[0].length + 400).replace(/<[^>]*>/g, ' ');
      const d = near.match(MONTHS);
      const parsed = d ? new Date(d[0].replace('.', '')) : null;
      const ok = parsed && !isNaN(parsed.getTime());
      out.push({
        source: feed.source,
        category: /^\/police\//.test(path) ? 'Busted' : feed.category,
        title, link: feed.base + path, summary: '',
        date: ok ? parsed! : new Date(Date.now() - out.length * 60000),
        approxDate: !ok,
      });
    }
    lastReport.push({ source: `${feed.source} (page)`, url: feed.url, status, count: out.length, ms: Date.now() - started, note: out.length ? undefined : `no headline links matched | ${html.slice(0, 100).replace(/\s+/g, ' ')}` });
    return out;
  } catch (e) {
    lastReport.push({ source: `${feed.source} (page)`, url: feed.url, status: e instanceof Error ? e.name : 'error', count: 0, ms: Date.now() - started });
    return [];
  } finally { clearTimeout(t); }
}

async function loadYouTube(feed: (typeof FEEDS)[number], channel: string, key: string): Promise<Story[]> {
  const started = Date.now();
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=15&playlistId=UU${channel.slice(2)}&key=${key}`;
  const shown = url.replace(key, '(key)');
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 8000);
  let status = 'error';
  try {
    const res = await fetch(url, { signal: c.signal });
    status = String(res.status);
    const j: any = res.ok ? await res.json() : null;
    const out: Story[] = (j?.items ?? []).map((it: any): Story | null => {
      const sn = it?.snippet;
      const id = sn?.resourceId?.videoId;
      if (!id || !sn?.title || /^(private|deleted) video$/i.test(sn.title)) return null;
      return { source: feed.source, category: feed.category, title: clean(sn.title, 160), link: `https://www.youtube.com/watch?v=${id}`, summary: clean(sn.description), videoId: id, image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, date: new Date(sn.publishedAt ?? 0) };
    }).filter((s: Story | null): s is Story => s !== null);
    lastReport.push({ source: `${feed.source} (YouTube API)`, url: shown, status, count: out.length, ms: Date.now() - started });
    return out;
  } catch (e) {
    lastReport.push({ source: `${feed.source} (YouTube API)`, url: shown, status: e instanceof Error ? e.name : 'error', count: 0, ms: Date.now() - started });
    return [];
  } finally { clearTimeout(t); }
}

async function loadOne(feed: (typeof FEEDS)[number]): Promise<Story[]> {
  const started = Date.now();
  let status = 'error';
  const record = (count: number, note?: string) => lastReport.push({ note, source: feed.source, area: (feed as any).area, url: /bizjournals\.com/.test(feed.url) ? '(private feed address, hidden)' : feed.url, status, count, ms: Date.now() - started });
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
    mk(10, 'NPR', 'National', 'Mock national story on grocery prices rising'), mk(11, 'Texas Tribune', 'National', 'Mock Texas lawmakers weigh property tax changes'), mk(12, 'NPR', 'National', 'Mock airline rule change could affect holiday travel'),
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
          refreshing = fetchLive(true).then((v) => saveStories(v.stories)).then(() => enrich()).catch(() => {}).finally(() => { refreshing = null; });
          runInBackground(refreshing);
        }
        const seenT = new Set<string>();
        const uniq = saved.stories.filter((s) => { const k = s.title.toLowerCase(); if (seenT.has(k)) return false; seenT.add(k); return true; });
        return { stories: uniq, sources: [...new Set(uniq.map((s) => s.source))] };
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
  const techUrl = getEnv('ABJ_TECH_FEED');
  const bizUrl = getEnv('ABJ_BUSINESS_FEED') ?? getEnv('ABJ_FEED');
  const feedList: any[] = [...FEEDS, ...PAGES, ...(techUrl ? [{ source: 'Austin Business Journal', category: 'Tech', url: techUrl }] : []), ...(bizUrl ? [{ source: 'Austin Business Journal', category: 'Business', url: bizUrl }] : [])];
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
