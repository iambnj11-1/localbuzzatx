import { XMLParser } from 'fast-xml-parser';

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
  { source: 'KVUE', category: 'News', url: 'https://www.kvue.com/feeds/syndication/rss/news/local' },
  { source: 'Austin Monitor', category: 'Government', url: 'https://www.austinmonitor.com/feed/' },
  // Community Impact: edition pages live at communityimpact.com/<edition>, feeds at /<edition>/feed. Ones that do not load are skipped.
  { source: 'Community Impact', area: 'Round Rock', category: 'Neighborhoods', url: 'https://communityimpact.com/round-rock/feed' },
  { source: 'Community Impact', area: 'Pflugerville-Hutto', category: 'Neighborhoods', url: 'https://communityimpact.com/pflugerville-hutto/feed' },
  { source: 'Community Impact', area: 'Pflugerville-Hutto', category: 'Neighborhoods', url: 'https://communityimpact.com/pflugerville/feed' },
  { source: 'Community Impact', area: 'Pflugerville-Hutto', category: 'Neighborhoods', url: 'https://communityimpact.com/hutto/feed' },
  { source: 'Community Impact', area: 'Georgetown', category: 'Neighborhoods', url: 'https://communityimpact.com/georgetown/feed' },
  { source: 'Community Impact', area: 'Cedar Park-Leander', category: 'Neighborhoods', url: 'https://communityimpact.com/cedar-park-leander/feed' },
  { source: 'Community Impact', area: 'Cedar Park-Leander', category: 'Neighborhoods', url: 'https://communityimpact.com/cedar-park/feed' },
  { source: 'Community Impact', area: 'Cedar Park-Leander', category: 'Neighborhoods', url: 'https://communityimpact.com/leander/feed' },
  { source: 'Community Impact', area: 'Central Austin', category: 'Neighborhoods', url: 'https://communityimpact.com/central-austin/feed' },
  { source: 'Community Impact', area: 'Lake Travis-Westlake', category: 'Neighborhoods', url: 'https://communityimpact.com/lake-travis-westlake/feed' },
  { source: 'Community Impact', area: 'Northwest Austin', category: 'Neighborhoods', url: 'https://communityimpact.com/northwest-austin/feed' },
  { source: 'Community Impact', area: 'Southwest Austin', category: 'Neighborhoods', url: 'https://communityimpact.com/southwest-austin/feed' },
  { source: 'Community Impact', area: 'Southeast Austin', category: 'Neighborhoods', url: 'https://communityimpact.com/southeast-austin/feed' },
  // Business and Tech. Addresses unverified; check /status.
  { source: 'Austin Business Journal', category: 'Business', url: 'http://feeds.bizjournals.com/bizj_austin' },
  { source: 'Silicon Hills News', category: 'Tech', url: 'https://siliconhillsnews.com/feed/' },
  { source: 'TOWERS', category: 'Development', url: 'https://austin.towers.net/feed' },
  { source: '365 Things Austin', category: 'Events', url: 'https://365thingsaustin.com/feed' },
  { source: 'Austin Monthly', category: 'Events', url: 'https://austinmonthly.com/feed' },
  // Video: YouTube channel feeds (embedded with YouTube's own player). The KVUE channel id is unverified; check /status.
  { source: 'KVUE', category: 'Watch', url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCxXTyFekH99JnS3qaXIQW7A' },
  // City of Austin: addresses below are guesses. If they do not load, they are skipped quietly.
  { source: 'City of Austin', category: 'Government', url: 'https://www.austintexas.gov/communications/news/rss' },
  { source: 'City of Austin', category: 'Government', url: 'https://www.austintexas.gov/news/feed' },
];

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

let cache: { at: number; value: { stories: Story[]; sources: string[] } } | null = null;
const TTL_MS = 10 * 60 * 1000;

export async function getStories(force = false): Promise<{ stories: Story[]; sources: string[] }> {
  if (!force && cache && Date.now() - cache.at < TTL_MS) return cache.value;
  lastReport = [];
  // Optional private feed address kept in a Cloudflare secret (not in the public code).
  const techUrl = typeof process !== 'undefined' ? process.env?.ABJ_TECH_FEED : undefined;
  const feedList = techUrl ? [...FEEDS, { source: 'Austin Business Journal', category: 'Tech', url: techUrl }] : FEEDS;
  const results = await Promise.all(feedList.map(loadFeed));
  const seen = new Set<string>();
  const stories = results
    .flat()
    .filter((s) => {
      const key = s.title.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  const sources = [...new Set(feedList.filter((_, i) => results[i].length > 0).map((f) => f.source))];
  const value = { stories, sources };
  if (stories.length > 0) cache = { at: Date.now(), value };
  return value;
}
