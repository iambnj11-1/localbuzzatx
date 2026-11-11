// Counts of APD-reported incidents from the City of Austin open data portal (dataset fdj4-gpfu).
// Counts only: no names, addresses or street-level details are read or shown.
export type CrimeSummary = { days: number; total: number; types: { name: string; n: number }[]; districts: { d: string; n: number }[] };

const BASE = 'https://data.austintexas.gov/resource/fdj4-gpfu.json';
const DAYS = 30;
let cache: { at: number; value: CrimeSummary | null } | null = null;
const TTL = 6 * 60 * 60 * 1000; // the portal updates weekly, so a few hours is plenty

async function q(select: string, where: string, group: string, order: string, limit: number): Promise<any[]> {
  const url = `${BASE}?${new URLSearchParams({ $select: select, $where: where, $group: group, $order: order, $limit: String(limit) })}`;
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 7000);
  try {
    const r = await fetch(url, { signal: c.signal, headers: { 'User-Agent': 'LocalBuzzATX/1.0' } });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j) ? j : [];
  } catch { return []; } finally { clearTimeout(t); }
}

export async function getCrime(): Promise<CrimeSummary | null> {
  if (typeof process !== 'undefined' && process.env?.LBA_MOCK) {
    return { days: DAYS, total: 5230, types: [{ name: 'Theft', n: 1480 }, { name: 'Burglary', n: 640 }, { name: 'Assault', n: 610 }, { name: 'Motor Vehicle Theft', n: 420 }, { name: 'Drug/Narcotic Violations', n: 380 }], districts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => ({ d: String(d), n: 200 + d * 40 })) };
  }
  if (cache && Date.now() - cache.at < TTL) return cache.value;
  const since = new Date(Date.now() - DAYS * 86400000).toISOString().slice(0, 10);
  const where = `occ_date >= '${since}T00:00:00'`;
  const [types, districts] = await Promise.all([
    q('category_description, count(*) as n', where, 'category_description', 'n DESC', 6),
    q('council_district, count(*) as n', `${where} AND council_district IS NOT NULL`, 'council_district', 'n DESC', 12),
  ]);
  let value: CrimeSummary | null = null;
  if (types.length) {
    const t = types.map((r) => ({ name: String(r.category_description ?? 'Other'), n: Number(r.n) }));
    const dd = districts.map((r) => ({ d: String(r.council_district), n: Number(r.n) })).filter((r) => /^\d+$/.test(r.d) && Number(r.d) >= 1 && Number(r.d) <= 10).sort((a, b) => Number(a.d) - Number(b.d));
    value = { days: DAYS, total: t.reduce((s, r) => s + r.n, 0), types: t, districts: dd };
  }
  if (value) cache = { at: Date.now(), value };
  return value;
}
