import type { Story } from './feeds';
import { getEnv, getMeta, setMeta, runInBackground } from './store';

// Hand-written reactions. `kw` finds the matching story in the live feeds so the card can link to it and show its photo.
export const reactions: { story: string; line: string; kw: string }[] = [
  { story: 'Austin Monitor: Austin-San Antonio rail study', kw: 'san antonio', line: 'Austin and San Antonio studying passenger rail again. At this point the studies might arrive before the train does.' },
  { story: 'TOWERS: Sixth Street reinvention', kw: 'sixth street', line: 'Austin has been trying to fix Sixth Street longer than some apartment leases last. Maybe this time the plan survives contact with reality.' },
  { story: 'TOWERS: Waterline penthouse', kw: 'waterline', line: 'The penthouse is ready. Now all you need is a small fortune and a strong opinion about floor-to-ceiling windows.' },
  { story: 'Austin Monitor: Zilker erosion issues', kw: 'zilker', line: "Austin's favorite park is aging like the rest of us: a little worn down and asking for money." },
  { story: 'Austin Monitor: $25M boardwalk', kw: 'boardwalk', line: 'Austin residents: "Don\'t spend my tax dollars." Also Austin residents: "Why is everything falling apart?"' },
  { story: 'Austin Monitor: Downtown height limits', kw: 'height limit', line: 'Every Austin development debate eventually becomes a fight between "we need housing" and "not like that."' },
  { story: 'Austin Monitor: Air taxis', kw: 'air taxi', line: "Austin traffic is so bad we're seriously considering flying over the problem now." },
  { story: 'Austin Transit Partnership begins planning light rail extension to the airport', kw: 'airport', line: 'Your future airport ride might take less time than finding parking.' },
  { story: 'Three days of rain on the way', kw: '', line: 'Austin drivers, you have been warned.' },
];

export function withStory(stories: Story[]) {
  return reactions.map((r) => {
    const src = r.story.split(':')[0].toLowerCase();
    const hit = r.kw
      ? stories.find((x) => x.title.toLowerCase().includes(r.kw) && x.source.toLowerCase().includes(src)) ?? stories.find((x) => x.title.toLowerCase().includes(r.kw))
      : undefined;
    return { ...r, link: hit?.link, image: hit?.image, label: r.story.includes(':') ? r.story.split(':')[0] : '', head: r.story.includes(':') ? r.story.split(':').slice(1).join(':').trim() : r.story };
  });
}

// Fresh takes each day: Haiku writes one dry, kind one-liner per live story, cached in D1 for the day.
// If the key or database is missing, or the call fails, the hand-written list above is used.
const SYSTEM = 'You write "OMG!" takes for Local Buzz ATX, an Austin news site. For each numbered story, write ONE dry, witty, good-natured one-liner (max 28 words) that pokes at Austin itself, never at victims, people in trouble, or anyone hurt. Skip jokes about crime, deaths, accidents, immigration, religion, or anyone\'s identity. If a story is too serious to joke about, set "skip": true. Reply with JSON only: [{"n":1,"line":"...","skip":false}]';

type Take = { story: string; line: string; kw: string; link?: string; image?: string; label: string; head: string };

function centralDay(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Chicago' });
}

async function generate(stories: Story[]): Promise<Take[] | null> {
  const key = getEnv('ANTHROPIC_API_KEY');
  if (!key) return null;
  const calm = /(crash|shoot|kill|dead|death|arrest|murder|fatal|police|suspect|stabb|assault|victim|immigra|e-verify)/i;
  const pool = stories.filter((s) => s.category !== 'Watch' && !calm.test(`${s.title} ${s.summary ?? ''}`)).slice(0, 14);
  if (pool.length < 4) return null;
  const content = pool.map((s, i) => `${i + 1}. ${s.title}${s.summary ? ` | ${s.summary}` : ''}`.slice(0, 380)).join('\n');
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 20000);
  try {
    const send = (extra: object) => fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', signal: c.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-5-5', max_tokens: 2500, system: SYSTEM, messages: [{ role: 'user', content }], ...extra }),
    });
    let res = await send({ thinking: { type: 'disabled' } });
    if (res.status === 400) res = await send({});
    if (!res.ok) return null;
    const data: any = await res.json();
    const raw: string = (data?.content ?? []).filter((b: any) => b?.type === 'text').map((b: any) => b.text).join('');
    const m = raw.match(/\[[\s\S]*\]/);
    if (!m) return null;
    const arr: any[] = JSON.parse(m[0]);
    const out: Take[] = [];
    for (const r of arr) {
      const s = pool[Number(r?.n) - 1];
      if (!s || r?.skip === true || typeof r?.line !== 'string' || r.line.length < 12) continue;
      out.push({ story: s.title, kw: '', line: r.line.trim().slice(0, 220), link: s.link, image: s.image, label: s.source, head: s.title });
    }
    return out.length >= 4 ? out.slice(0, 8) : null;
  } catch { return null; } finally { clearTimeout(t); }
}

export async function getTakes(stories: Story[]): Promise<Take[]> {
  const day = centralDay();
  try {
    const cached = await getMeta(`omg_${day}`);
    if (cached) { const j = JSON.parse(cached); if (Array.isArray(j) && j.length) return j; }
    const fresh = await generate(stories);
    if (fresh) { runInBackground(setMeta(`omg_${day}`, JSON.stringify(fresh))); return fresh; }
  } catch { /* fall through */ }
  return withStory(stories) as Take[];
}

// OMG of the Day: one take, stable all day, different tomorrow.
export function ofTheDay<T>(takes: T[]): T {
  const n = Math.floor(new Date(centralDay()).getTime() / 86400000);
  return takes[n % takes.length];
}
