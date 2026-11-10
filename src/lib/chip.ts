import type { Story } from './feeds';

export const chipClass = (s: Story) =>
  ({ KXAN: 'kxan', KVUE: 'kvue', 'City of Austin': 'city', 'Community Impact': 'ci', 'Austin Monitor': 'monitor' } as Record<string, string>)[s.source] ?? '';

export const chipLabel = (s: Story) => (s.area ? `${s.source} · ${s.area}` : s.source);
