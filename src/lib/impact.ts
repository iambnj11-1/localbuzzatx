import type { Story } from './feeds';

// How much a story is likely to touch daily life in Austin. Uses the AI's saved 1-5 rating when there is one,
// and simple word cues until then. Newer beats older, and soft stories (weather graphics, listicles) sink.
const BOOST = /\b(council|vote[sd]?|ordinance|budget|tax(es)?|rent|housing|home prices?|mortgage|layoffs?|hiring|jobs?|closing|closes|shut(s| down)|outage|boil water|water|power|energy|utility|bills?|fees?|transit|capmetro|rail|i-35|road|lane closures?|airport|school|aisd|district|tuition|hospital|health|wage|minimum|inflation|prices?|recall|evacuat\w+|warning|emergency|flood(ing)?|freeze|tornado|storm|apple|tesla|samsung|oracle|dell|data center)\b/i;
const SOFT = /\b(weather|forecast|sunshine|sunny|showers|rain chances?|temperatures?|first alert|first warning|cooler|warmer|warm|cold front|week ahead|photos?|gallery|things to do|best of|top \d+|recipes?)\b/i;
const URGENT = /\b(warning|tornado|flood(ing)?|freeze|ice|winter storm|evacuat\w+|emergency|boil water|outage)\b/i;

export const isSoft = (s: Story) => SOFT.test(s.title) && !URGENT.test(s.title);

export function impactScore(s: Story, now = Date.now()): number {
  const ageH = Math.max(0, (now - s.date.getTime()) / 3600000);
  const base = s.impact != null ? s.impact * 12 : BOOST.test(`${s.title} ${s.summary}`) ? 30 : 18;
  let score = base - Math.min(ageH, 96) * 0.7;
  if (isSoft(s)) score -= 30;
  if (s.image) score += 3;
  if (s.summary) score += 2;
  return score;
}

export const bySignal = (a: Story, b: Story) => impactScore(b) - impactScore(a);
