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
