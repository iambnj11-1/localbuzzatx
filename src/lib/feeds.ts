import { XMLParser } from 'fast-xml-parser';

export type Story = {
  source: string;
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
];

const parser = new XMLParser({ ignoreAttributes: false, processEntities: true });

const clean = (value: unknown, max = 200): string => {
  const text = String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
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

export async function getStories(): Promise<{ stories: Story[]; sources: string[] }> {
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
  const sources = FEEDS.filter((_, i) => results[i].length > 0).map((f) => f.source);
  return { stories, sources };
}
