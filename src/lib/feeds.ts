import { XMLParser } from 'fast-xml-parser';

export type Story = {
  source: string;
  area?: string;
  category: string;
  title: string;
  link: string;
  summary: string;
  date: Date;
};

// Add or remove outlets here. Only the headline, a short blurb and a link back are used.
export const FEEDS = [
  { source: 'KXAN', category: 'News', url: 'https://www.kxan.com/feed/' },
  { source: 'KVUE', category: 'News', url: 'https://www.kvue.com/feeds/syndication/rss/news/local' },
  { source: 'Austin Monitor', category: 'Government', url: 'https://www.austinmonitor.com/feed/' },
  // Community Impact: several possible addresses per area. Ones that do not load are skipped; duplicates are removed.
  { source: 'Community Impact', area: 'Austin', category: 'Neighborhoods', url: 'https://communityimpact.com/austin/feed' },
  { source: 'Community Impact', area: 'Round Rock', category: 'Neighborhoods', url: 'https://communityimpact.com/austin/round-rock/feed' },
  { source: 'Community Impact', area: 'Round Rock', category: 'Neighborhoods', url: 'https://communityimpact.com/round-rock-pflugerville-hutto/feed' },
  { source: 'Community Impact', area: 'Round Rock', category: 'Neighborhoods', url: 'https://communityimpact.com/austin/round-rock-pflugerville-hutto/feed' },
  { source: 'Community Impact', area: 'Pflugerville-Hutto', category: 'Neighborhoods', url: 'https://communityimpact.com/austin/pflugerville-hutto/feed' },
  { source: 'Community Impact', area: 'Pflugerville-Hutto', category: 'Neighborhoods', url: 'https://communityimpact.com/round-rock-pflugerville-hutto/feed' },
  { source: 'Community Impact', area: 'Georgetown', category: 'Neighborhoods', url: 'https://communityimpact.com/austin/georgetown/feed' },
  { source: 'Community Impact', area: 'Georgetown', category: 'Neighborhoods', url: 'https://communityimpact.com/georgetown/feed' },
  { source: 'Community Impact', area: 'Cedar Park', category: 'Neighborhoods', url: 'https://communityimpact.com/austin/cedar-park-far-northwest-austin/feed' },
  { source: 'Community Impact', area: 'Cedar Park', category: 'Neighborhoods', url: 'https://communityimpact.com/austin/cedar-park-leander/feed' },
  { source: 'Community Impact', area: 'Cedar Park', category: 'Neighborhoods', url: 'https://communityimpact.com/cedar-park-leander/feed' },
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

const text = (v: any): string => (typeof v === 'object' && v !== null ? String(v['#text'] ?? '') : String(v ?? ''));

async function loadFeed(feed: (typeof FEEDS)[number]): Promise<Story[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(feed.url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'LocalBuzzATX/1.0 (+headline aggregator, links back to source)' },
    });
    if (!res.ok) return [];
    const xml = parser.parse(await res.text());
    const rawItems = xml?.rss?.channel?.item ?? xml?.feed?.entry ?? [];
    const items = Array.isArray(rawItems) ? rawItems : [rawItems];
    return items
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
          summary: clean(text(it.description ?? it.summary)),
          date: isNaN(date.getTime()) ? new Date(0) : date,
        };
      })
      .filter((s): s is Story => s !== null)
      .slice(0, 15);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

let cache: { at: number; value: { stories: Story[]; sources: string[] } } | null = null;
const TTL_MS = 10 * 60 * 1000;

export async function getStories(): Promise<{ stories: Story[]; sources: string[] }> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;
  const results = await Promise.all(FEEDS.map(loadFeed));
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
  const sources = [...new Set(FEEDS.filter((_, i) => results[i].length > 0).map((f) => f.source))];
  const value = { stories, sources };
  if (stories.length > 0) cache = { at: Date.now(), value };
  return value;
}
