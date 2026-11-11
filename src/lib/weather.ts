// National Weather Service (free, no key). Fails quietly: if anything goes wrong the weather simply does not show.
export type Weather = { temp: number; summary: string; rain: number | null; alert: string | null };

const POINT = '30.2672,-97.7431';
const HEADERS = { 'User-Agent': 'LocalBuzzATX/1.0 (local news site)', Accept: 'application/geo+json' };
let cache: { at: number; value: Weather | null } | null = null;
const TTL_MS = 10 * 60 * 1000;

async function getJson(url: string): Promise<any> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch(url, { headers: HEADERS, signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function getWeather(): Promise<Weather | null> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;
  let value: Weather | null = null;
  try {
    const point = await getJson(`https://api.weather.gov/points/${POINT}`);
    const forecastUrl = point?.properties?.forecastHourly;
    const [forecast, alerts] = await Promise.all([
      forecastUrl ? getJson(forecastUrl) : null,
      getJson(`https://api.weather.gov/alerts/active?point=${POINT}`),
    ]);
    const now = forecast?.properties?.periods?.[0];
    if (now && typeof now.temperature === 'number') {
      const serious = (alerts?.features ?? []).find((f: any) => ['Severe', 'Extreme'].includes(f?.properties?.severity));
      value = {
        temp: now.temperature,
        summary: String(now.shortForecast ?? '').slice(0, 40),
        rain: now.probabilityOfPrecipitation?.value ?? null,
        alert: serious?.properties?.headline ? String(serious.properties.headline).slice(0, 160) : null,
      };
    }
  } catch {
    value = null;
  }
  if (value) cache = { at: Date.now(), value };
  return value;
}

export type Day = { name: string; hi: number | null; lo: number | null; short: string; detail: string; wind: string; rain: number | null; icon: string };
export type Hour = { time: string; temp: number; rain: number | null; icon: string };
export type Forecast = { now: { temp: number; short: string; wind: string; rain: number | null; icon: string; hi: number | null; lo: number | null }; hours: Hour[]; days: Day[]; alerts: string[] };

export const icon = (t: string, night = false) => {
  const s = t.toLowerCase();
  if (/thunder|t-storm/.test(s)) return '⛈️';
  if (/snow|sleet|flurr|ice|freezing/.test(s)) return '❄️';
  if (/rain|shower|drizzle/.test(s)) return '🌧️';
  if (/fog|haze|smoke/.test(s)) return '🌫️';
  if (/wind|breezy/.test(s) && !/cloud/.test(s)) return '💨';
  if (/mostly cloudy|overcast/.test(s)) return '☁️';
  if (/partly|mostly sunny|mostly clear/.test(s)) return night ? '🌙' : '⛅';
  if (/cloud/.test(s)) return '☁️';
  if (/sunny|clear/.test(s)) return night ? '🌙' : '☀️';
  return '🌤️';
};

let fcache: { at: number; value: Forecast | null } | null = null;
export async function getForecast(): Promise<Forecast | null> {
  if (typeof process !== 'undefined' && process.env?.LBA_MOCK) {
    const d = (name: string, hi: number | null, lo: number, short: string): Day => ({ name, hi, lo, short, detail: '', wind: '10 mph S', rain: 20, icon: icon(short) });
    return { now: { temp: 71, short: 'Partly Sunny', wind: '8 mph S', rain: 10, icon: '⛅', hi: 78, lo: 55 }, hours: Array.from({ length: 12 }, (_, i) => ({ time: `${(i + 1) % 12 || 12} PM`, temp: 70 - i, rain: i * 3, icon: '⛅' })), days: [d('Today', 78, 55, 'Partly Sunny'), d('Wednesday', 80, 58, 'Sunny'), d('Thursday', 74, 52, 'Chance Showers'), d('Friday', 66, 48, 'Mostly Cloudy'), d('Saturday', 70, 50, 'Sunny'), d('Sunday', 72, 54, 'Sunny'), d('Monday', 75, 57, 'Partly Cloudy')], alerts: [] };
  }
  if (fcache && Date.now() - fcache.at < TTL_MS) return fcache.value;
  let value: Forecast | null = null;
  try {
    const point = await getJson(`https://api.weather.gov/points/${POINT}`);
    const [fc, hr, alerts] = await Promise.all([
      point?.properties?.forecast ? getJson(point.properties.forecast) : null,
      point?.properties?.forecastHourly ? getJson(point.properties.forecastHourly) : null,
      getJson(`https://api.weather.gov/alerts/active?point=${POINT}`),
    ]);
    const periods: any[] = fc?.properties?.periods ?? [];
    const hours: any[] = hr?.properties?.periods ?? [];
    if (periods.length && hours.length) {
      const days: Day[] = [];
      for (let i = 0; i < periods.length && days.length < 7; i++) {
        const p = periods[i];
        const day = p.isDaytime ? p : null;
        const night = p.isDaytime ? periods[i + 1] : p;
        if (p.isDaytime) i++;
        const lead = day ?? night;
        days.push({
          name: day ? String(day.name) : 'Tonight',
          hi: day ? day.temperature : null,
          lo: night && !night.isDaytime ? night.temperature : null,
          short: String(lead.shortForecast ?? ''),
          detail: String(lead.detailedForecast ?? ''),
          wind: `${lead.windSpeed ?? ''} ${lead.windDirection ?? ''}`.trim(),
          rain: lead.probabilityOfPrecipitation?.value ?? null,
          icon: icon(String(lead.shortForecast ?? ''), !day),
        });
      }
      const n = hours[0];
      value = {
        now: { temp: n.temperature, short: String(n.shortForecast ?? ''), wind: `${n.windSpeed ?? ''} ${n.windDirection ?? ''}`.trim(), rain: n.probabilityOfPrecipitation?.value ?? null, icon: icon(String(n.shortForecast ?? ''), n.isDaytime === false), hi: days[0]?.hi ?? null, lo: days[0]?.lo ?? days[1]?.lo ?? null },
        hours: hours.slice(0, 12).map((h: any) => ({ time: new Date(h.startTime).toLocaleTimeString('en-US', { hour: 'numeric', timeZone: 'America/Chicago' }), temp: h.temperature, rain: h.probabilityOfPrecipitation?.value ?? null, icon: icon(String(h.shortForecast ?? ''), h.isDaytime === false) })),
        days,
        alerts: (alerts?.features ?? []).map((a: any) => String(a?.properties?.headline ?? '')).filter(Boolean).slice(0, 5),
      };
    }
  } catch { value = null; }
  if (value) fcache = { at: Date.now(), value };
  return value;
}
