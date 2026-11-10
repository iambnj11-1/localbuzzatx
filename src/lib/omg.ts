import type { Story } from './feeds';

// Hand-written reactions. `kw` finds the matching story in the live feeds so the card can link to it and show its photo.
export const reactions: { story: string; line: string; kw: string }[] = [
  { story: 'Austin Monitor: Austin-San Antonio rail study', kw: 'san antonio', line: 'Austin and San Antonio studying passenger rail again. At this point the studies might arrive before the train does.' },
  { story: 'TOWERS: Sixth Street reinvention', kw: 'sixth street', line: 'Austin has been trying to fix Sixth Street longer than some apartment leases last. Maybe this time the plan survives contact with reality.' },
  { story: 'TOWERS: Waterline penthouse', kw: 'waterline', line: 'The penthouse is ready. Now all you need is a small fortune and a strong opinion about floor-to-ceiling windows.' },
  { story: 'Austin Monitor: Zilker erosion issues', kw: 'zilker', line: "Austin's favorite park is aging like the rest of us: a little worn down and asking for money." },
  { story: 'Austin Monitor: $25M boardwalk', kw: 'boardwalk', line: 'Austin residents: "Don\'t spend my tax dollars." Also Austin residents: "Why is everything falling apart?"' },
  { story: 'Austin Monitor: Downtown height limits', kw: 'height limit', line: 'Every Austin development debate eventually becomes a fight between "we need housing" and "not like that."' },
  { story: 'Austin Monitor: Air taxis', kw: 'air taxi', line: "Austin traffic is so bad we're seriously considering flying over the problem now." },
  { story: 'KXAN: E-Verify bill', kw: 'e-verify', line: 'Texas looked at immigration, labor shortages and hiring paperwork and said, "You know what this situation needs? More paperwork."' },
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
