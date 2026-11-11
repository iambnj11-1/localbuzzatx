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
  // AI notes for each story, written once: a shorter headline, a "why it matters" line, and topic flags.
  await db.exec('CREATE TABLE IF NOT EXISTS ai (link TEXT PRIMARY KEY, short_title TEXT, why TEXT, crime INTEGER, money INTEGER, created_at INTEGER NOT NULL)');
  await db.exec('CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT)');
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
  const { results } = await db.prepare('SELECT s.*, a.short_title, a.why, a.crime, a.money, a.link AS ai_link FROM stories s LEFT JOIN ai a ON a.link = s.link ORDER BY s.published_at DESC LIMIT 300').all();
  const newest = await db.prepare('SELECT MAX(fetched_at) AS t FROM stories').first();
  const stories: Story[] = (results ?? []).map((r: any) => ({
    source: r.source, area: r.area ?? undefined, category: r.category, title: r.short_title || r.title, origTitle: r.title, link: r.link,
    why: r.why || undefined, crime: r.ai_link ? r.crime === 1 : undefined, money: r.ai_link ? r.money === 1 : undefined,
    summary: r.summary ?? '', videoId: r.video_id ?? undefined, image: r.image ?? undefined, date: new Date(r.published_at),
  }));
  return { stories, newest: Number(newest?.t ?? 0) };
}

export async function pendingForAi(limit: number): Promise<{ link: string; title: string; summary: string }[]> {
  const db = getDb();
  if (!db) return [];
  await init(db);
  const { results } = await db.prepare("SELECT s.link, s.title, s.summary FROM stories s LEFT JOIN ai a ON a.link = s.link WHERE a.link IS NULL AND s.category != 'Watch' ORDER BY s.published_at DESC LIMIT ?1").bind(limit).all();
  return (results ?? []) as any;
}

export async function saveAi(rows: { link: string; title?: string; why?: string; crime?: boolean; money?: boolean }[]) {
  const db = getDb();
  if (!db || !rows.length) return;
  await init(db);
  const stmt = db.prepare('INSERT OR REPLACE INTO ai (link, short_title, why, crime, money, created_at) VALUES (?1,?2,?3,?4,?5,?6)');
  await db.batch(rows.map((r) => stmt.bind(r.link, r.title ?? null, r.why ?? null, r.crime ? 1 : 0, r.money ? 1 : 0, Date.now())));
}

export async function setMeta(k: string, v: string) {
  const db = getDb();
  if (!db) return;
  await init(db);
  await db.prepare('INSERT OR REPLACE INTO meta (k, v) VALUES (?1, ?2)').bind(k, v).run();
}

export async function aiStats(): Promise<{ stories: number; done: number; last: string } | null> {
  const db = getDb();
  if (!db) return null;
  await init(db);
  const a = await db.prepare("SELECT (SELECT COUNT(*) FROM stories WHERE category != 'Watch') AS stories, (SELECT COUNT(*) FROM ai) AS done, (SELECT v FROM meta WHERE k = 'ai_last') AS last").first();
  return { stories: Number(a?.stories ?? 0), done: Number(a?.done ?? 0), last: String(a?.last ?? 'not run yet') };
}
