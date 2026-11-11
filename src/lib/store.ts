import type { Story } from './feeds';

// Saved stories live in a Cloudflare D1 database. If the database isn't connected, the site
// falls back to reading feeds live, so nothing breaks.
let runtime: any = null;
export const setRuntime = (r: any) => { runtime = r; };
export const getEnv = (name: string): string | undefined => runtime?.env?.[name] ?? (typeof process !== 'undefined' ? process.env?.[name] : undefined);
export const getDb = (): any => runtime?.env?.DB ?? null;
export const runInBackground = (p: Promise<unknown>) => {
  try { runtime?.ctx?.waitUntil?.(p); } catch { /* ignore */ }
};

let ready = false;
async function init(db: any) {
  if (ready) return;
  await db.exec('CREATE TABLE IF NOT EXISTS stories (link TEXT PRIMARY KEY, source TEXT NOT NULL, area TEXT, category TEXT NOT NULL, title TEXT NOT NULL, summary TEXT, video_id TEXT, image TEXT, published_at INTEGER NOT NULL, fetched_at INTEGER NOT NULL)');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_stories_pub ON stories (published_at DESC)');
  ready = true;
}

export async function saveStories(stories: Story[]) {
  const db = getDb();
  if (!db || stories.length === 0) return;
  await init(db);
  const now = Date.now();
  const stmt = db.prepare(
    'INSERT INTO stories (link, source, area, category, title, summary, video_id, image, published_at, fetched_at) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10) ' +
    'ON CONFLICT(link) DO UPDATE SET source=?2, area=?3, category=?4, title=?5, summary=?6, video_id=?7, image=COALESCE(?8, image), published_at=CASE WHEN ?11 = 1 THEN published_at ELSE ?9 END, fetched_at=?10',
  );
  const rows = stories.map((s) => stmt.bind(s.link, s.source, s.area ?? null, s.category, s.title, s.summary ?? '', s.videoId ?? null, s.image ?? null, s.date.getTime(), now, s.approxDate ? 1 : 0));
  for (let i = 0; i < rows.length; i += 50) await db.batch(rows.slice(i, i + 50));
  // Keep about six months of stories so the database stays small.
  await db.prepare('DELETE FROM stories WHERE published_at > 0 AND published_at < ?1').bind(now - 180 * 86400000).run();
}

export async function readStories(): Promise<{ stories: Story[]; newest: number } | null> {
  const db = getDb();
  if (!db) return null;
  await init(db);
  const { results } = await db.prepare('SELECT * FROM stories ORDER BY published_at DESC LIMIT 300').all();
  const newest = await db.prepare('SELECT MAX(fetched_at) AS t FROM stories').first();
  const stories: Story[] = (results ?? []).map((r: any) => ({
    source: r.source, area: r.area ?? undefined, category: r.category, title: r.title, link: r.link,
    summary: r.summary ?? '', videoId: r.video_id ?? undefined, image: r.image ?? undefined, date: new Date(r.published_at),
  }));
  return { stories, newest: Number(newest?.t ?? 0) };
}
