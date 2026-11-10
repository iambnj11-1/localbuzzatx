import type { Story } from './feeds';

export const chipClass = (s: Story) =>
  ({ KXAN: 'kxan', KVUE: 'kvue', 'City of Austin': 'city', 'Community Impact': 'ci', 'Austin Monitor': 'monitor', TOWERS: 'towers', 'Austin Monthly': 'monthly', '365 Things Austin': 'things', 'Austin Business Journal': 'abj', 'Silicon Hills News': 'tech', 'Spectrum News Austin': 'spec', 'West Austin News': 'wan', Austonia: 'auso', 'Black Austin Matters': 'bam' } as Record<string, string>)[s.source] ?? '';

export const chipLabel = (s: Story) => (s.area ? `${s.source} · ${s.area}` : s.source);
