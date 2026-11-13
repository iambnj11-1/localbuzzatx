// Blog posts for Caleb's Corner and Tori's pages.
// Block types: p (paragraph), h (heading), quote (pull-quote card), img (picture), list.
export type Block =
  | { t: 'p'; text: string }
  | { t: 'h'; text: string }
  | { t: 'quote'; text: string }
  | { t: 'img'; src: string; alt: string; caption?: string }
  | { t: 'list'; items: string[] };

export interface Source { name: string; url?: string; short?: string }

export interface Post {
  slug: string;
  author: 'tori' | 'caleb' | 'localbuzz';
  lane: string; // e.g. "Quick Tea", "Tori's Take", "Caleb Reports"
  title: string;
  dek: string;
  date: string; // ISO yyyy-mm-dd
  cover?: { src: string; alt: string; portrait?: boolean };
  body: Block[];
  take: string;
  takeLabel: string;
  sources: Source[];
  note?: string; // small line under the post, e.g. not financial advice
  draft?: boolean; // hidden from lists; opens only with ?preview=1
  teaser?: boolean; // short preview of a piece Tori is still finishing
  hero?: boolean; // featured as the top story on the author's page
  topic?: string; // row on Caleb's page, e.g. "Cybersecurity"
  cardCover?: string; // tall 3:4 image used only on list cards
  related?: string[]; // slugs of related posts, shown as a link box under the article
  photoCredit?: { by: string; via: string; url: string; license: string; licenseUrl: string; changes: string };
}

const p = (text: string): Block => ({ t: 'p', text });
const h = (text: string): Block => ({ t: 'h', text });
const L = (s: string): Block[] => s.trim().split('\n').map((x) => x.trim()).filter(Boolean).map((x) => p(x.replace(/'/g, '\u2019')));

const THEROOT = 'https://www.theroot.com/black-films-to-look-forward-to-in-2026-2000079848';
const BOM = 'https://www.boxofficemojo.com/calendar/2026-11-06';

export const authors = {
  tori: {
    name: 'Tori',
    path: '/blog/tori',
    home: '/blog/tori',
    img: '/authors/tori.jpg',
    tagline: 'Celebrity buzz, entertainment news, viral moments, and the stories everyone’s group chat is talking about.',
    bio: 'Tori covers celebrity buzz, entertainment news, viral moments, and the conversations people can’t stop having. Whether it’s a movie premiere, a relationship headline, or a life lesson learned the hard way, she’s always ready with a fresh take.',
    facts: ['🎬 Celebrity news, movies, and entertainment are her thing.', '🏀 Steph Curry fan since day one.', '💗 Believes the best stories come from family, relationships, and everyday life.'],
    pen: 'Tori is a pen name, and her picture is an illustration.',
  },
  caleb: {
    name: 'Caleb',
    path: '/blog/caleb',
    home: '/blog/caleb',
    img: '/authors/caleb-v2.jpg',
    tagline: 'Cybersecurity and tech, and what it means for everyone in Austin.',
    bio: 'Caleb covers cybersecurity, technology, and the trends shaping Austin and Central Texas. He breaks down complex stories into plain English and helps readers of every age and background understand what happened and how to stay safe online.',
    facts: ['🤖 AI, technology, and cybersecurity are his thing.', '☕ Usually asking, “Okay... but what does this mean for us?”', '🏙️ Believes Austin’s growth should create opportunities for everyone.'],
    pen: 'Caleb is a pen name, and his picture is an illustration.',
  },
  localbuzz: {
    name: 'Local Buzz ATX',
    path: '/blog/localbuzz',
    home: '/guides',
    img: '/favicon.svg',
    tagline: 'Plain-English guides for Travis and Williamson counties, with sources you can check.',
    bio: 'Local Buzz ATX guides are put together from official city and county sources and checked before publishing. Each one shows its sources and the date it was last checked.',
    facts: [],
    pen: 'Local Buzz ATX guides are written for readers in Travis and Williamson counties. Send corrections to the contact page.',
  },
} as const;

export const posts: Post[] = [
  // ---------------- Tori: Tori's Take ----------------
  {
    slug: 'forgiveness-doesnt-mean-it-didnt-hurt',
    author: 'tori',
    lane: 'Tori’s Take',
    title: 'Forgiveness Doesn’t Mean It Didn’t Hurt',
    dek: 'A personal reflection on letting go, finding peace, and learning that forgiveness is just as powerful for you as it is for them.',
    date: '2026-11-12',
    cardCover: '/blog/forgiveness-cover-tall.jpg',
    cover: { src: '/blog/forgiveness-cover-red.jpg', alt: 'Illustration of Tori journaling at a desk with an Austin skyline behind her' },
    body: [
      ...L(`
There was a time when I thought forgiveness meant pretending everything was okay.
Smile.
Move on.
Don't bring it up again.
Act like it never happened.
The older I've gotten, the more I've realized that's not forgiveness at all.
That's avoidance.
Lately, I've been working through some hurt in my own family. Not the kind of hurt that comes from strangers. The kind of hurt that comes from people you love. The kind that catches you off guard because you never expected it from them.
For a while, I carried it around with me everywhere.
I replayed conversations in my head.
I thought about all the things I should have said.
I imagined apologies that never came.
Some days I convinced myself I was over it. Other days, the smallest thing would remind me, and all the frustration would come rushing back.
What I've learned is that unresolved hurt has a way of taking up space in your life. It sits quietly in the background, showing up when you least expect it.
The hardest lesson for me has been understanding that forgiveness isn't always about the other person.
Sometimes it's about you.
Forgiveness doesn't mean what happened was acceptable.
It doesn't mean there should be no consequences.
It doesn't mean trust is automatically restored.
And it definitely doesn't mean erasing the memory like it never happened.
If anything, true forgiveness requires remembering.
You acknowledge what happened.
You acknowledge the pain.
You acknowledge the disappointment.
Then you decide the hurt no longer gets to control your life.
That's the part I'm still learning.
`),
      ...L(`
I've realized that holding on to anger feels powerful at first. It feels like protection. It feels like justice.
But after a while, it starts costing more than it's worth.
`),
      { t: 'quote', text: 'Holding on to anger feels powerful at first\u2026 after a while, it starts costing more than it\u2019s worth.' },
      ...L(`
The other person may not even know you're carrying that weight.
Meanwhile, you're the one losing sleep.
You're the one replaying old conversations.
You're the one carrying the burden.
Forgiveness doesn't always set the other person free.
Sometimes it sets you free.
That doesn't mean reconciliation is required. Every relationship is different. Some wounds heal together. Some heal from a distance.
But freedom comes when you stop giving yesterday permission to ruin today.
`),
      { t: 'img', src: '/blog/forgiveness-bridge.jpg', alt: 'Illustration of Tori walking across a bridge over Lady Bird Lake at sunset, with the words Let it go. Not because they deserve it. Because you deserve peace.' },
      ...L(`
I'm still a work in progress.
There are still moments when old feelings creep back in.
There are still conversations I wish had gone differently.
There are still things I don't fully understand.
But I'm learning that peace isn't found in pretending something didn't happen.
Peace comes from accepting that it happened, learning from it, and refusing to let it define you forever.
`),
      { t: 'quote', text: 'Peace isn\u2019t found in pretending something didn\u2019t happen.' },
      ...L(`
Maybe that's what growth really looks like.
Not becoming someone who never gets hurt.
But becoming someone who doesn't let hurt become their identity.
If you're carrying pain from someone you love, I don't have all the answers.
I'm walking that road too.
But I know this:
Forgiveness isn't weakness.
Forgiveness isn't forgetting.
Forgiveness is choosing your peace over your pain.
And sometimes that's one of the strongest things you can do.
`),
    ],
    take: 'The person who hurt you may never fully understand the impact of what happened. They may never apologize the way you hoped. They may never even realize how deeply it affected you.\n\nDon\u2019t let that stop your healing.\n\nYour peace is too valuable to leave in someone else\u2019s hands. \ud83d\udc97',
    takeLabel: 'Tori’s Take',
    sources: [],
  },
  {
    slug: 'the-friend-who-always-checks-on-everyone',
    author: 'tori',
    lane: 'Tori’s Take',
    cardCover: '/blog/tori-friend-cover-tall.jpg',
    cover: { src: '/blog/tori-friend-cover.jpg', alt: 'Illustration of Tori smiling at a text message on her phone, with the Austin skyline and Lady Bird Lake behind her' },
    title: 'The Friend Who Always Checks On Everyone',
    dek: 'Sometimes the smallest check-in can mean more than we realize.',
    date: '2026-11-13',
    body: [
      ...L(`
We’ve all met that person.
The one who remembers birthdays.
The one who remembers anniversaries.
The one who somehow remembers that thing you mentioned three months ago and follows up to see how it went.
For a long time, I used to think staying connected meant having hours of free time to sit around and catch up. When life got hectic, I’d tell myself I’d call next week, or next month, once things slowed down.
The truth is, life rarely slows down on its own.
Just the other day, I finally reached out to a friend I hadn’t talked to in a long time. Life has been heavy and moving fast lately, and honestly, it would have been easy to keep putting it off.
But the second we started talking, it felt good. Like no time had passed at all. We laughed, caught up on real life, and made plans to get together for tea time real soon.
And sitting with that afterward, I realized something: that conversation wasn’t just nice. It was right on time.
There is a different kind of peace that comes from knowing you have someone genuinely in your corner.
Not someone who just hits "like" on a photo and keeps scrolling.
Not someone who says "we need to link up" just to fill the silence.
Somebody who actually cares how your spirit is doing.
`),
      { t: 'quote', text: 'Feeling remembered matters, especially when life gets loud.' },
      ...L(`
We live in a world where everybody is busy, everybody is tired, and everybody is carrying something nobody else sees.
That’s why intentional effort stands out so much today.
You don’t need a grand gesture to show up for the people you love.
You don’t need an expensive gift or a three-hour phone call.
You just need to make the effort when someone crosses your mind.
A quick "How are you really doing?"
A simple "Thinking about you today."
A random "I’m in your corner."
Those little check-ins add up. They remind people they aren’t walking through this life invisible or alone.
`),
      { t: 'img', src: '/blog/tori-friend-scene.jpg', alt: 'Illustration of Tori on the Lady Bird Lake trail at sunset with a pink backpack that says Check on your people, with the words Feeling remembered matters.' },
      ...L(`
I’m learning not to ignore that nudge when a friend pops into my head.
Because half the time, that nudge shows up for a reason. Maybe they needed the encouragement, or maybe, like me the other day, you were the one who needed the reminder that good people are still walking alongside you.
I think we sometimes talk ourselves out of reaching out.
We tell ourselves they’re probably busy.
We wonder if the text will feel random.
We worry it’s been too long and it’ll be awkward.
But the awkward part usually lasts about thirty seconds. How it makes someone feel can last all day.
And if a friend ever reaches out to you out of the blue, take it as the gift it is. Somebody thought of you, and they cared enough to say so.
`),
      { t: 'quote', text: 'You don’t need a grand gesture to show up for the people you love.' },
      ...L(`
None of us know the full weight someone else is carrying behind closed doors.
And sometimes the smallest check-in arrives at the exact moment it was needed most.
`),
    ],
    take: 'Never underestimate the power of making someone feel remembered.\n\nDon’t wait for life to slow down before you reach out to your people. Send the text, make the call, schedule the tea time.\n\nA few minutes of real connection can carry somebody through a whole week. 💗',
    takeLabel: 'Tori’s Take',
    sources: [],
  },
  {
    slug: 'some-apologies-change-everything',
    author: 'tori',
    lane: 'Tori’s Take',
    cardCover: '/blog/tori-apologies.jpg',
    cover: { src: '/blog/tori-apologies-cover.jpg', alt: 'Illustration of Tori resting her chin on her hand and gazing thoughtfully past the Texas Capitol and the Austin skyline' },
    title: 'Some Apologies Change Everything. Some Never Come.',
    dek: 'The older I get, the more I realize healing and closure aren’t always the same thing.',
    date: '2026-11-13',
    body: [
      ...L(`
When I was younger, I thought every hurt could be fixed with an apology.
Now I’m not so sure.
Life has a funny way of teaching lessons we never asked for.
For a long time, when someone crossed a line or broke my trust, I’d sit around waiting for them to make it right. I wanted them to see what they did. I wanted them to own it.
Waiting on an apology that never comes will drive you crazy.
It’s like sitting through a whole setup waiting for a punchline, and there isn’t one.
And what makes it even harder is realizing that even when an apology does come, sometimes it’s just an apology for apology’s sake.
No morals behind it.
No real values attached.
Just words thrown out to sweep things under the rug so they don’t have to feel uncomfortable anymore.
I used to think that kind of disrespect only came from younger folks who didn’t know any better, but the older I get, I’ve seen plenty of older ones move the exact same way. Saying "sorry" today and repeating the exact same behavior tomorrow.
`),
      { t: 'quote', text: 'Not every apology arrives. And not every apology would fix things if it did.' },
      ...L(`
For a while, I let that eat at me.
I replayed what happened.
I wondered how someone could act like they didn’t know what they did.
I wanted closure to look like a real conversation and real accountability.
Until one day it hit me: those thoughts were living rent-free in my mind.
They had moved on with their day, completely unbothered, while I was the one carrying the frustration around.
That’s when I made a decision. If they weren’t going to change, I had to choose a different outlet for my energy.
Letting go isn’t one big moment. It’s a decision you make again and again, and some days it’s harder than others.
Some days it feels easy. Other days, something small drags it all back, and you have to choose peace all over again.
That’s not failure. That’s just being human.
`),
      { t: 'img', src: '/blog/tori-apologies-scene.jpg', alt: 'Illustration of Tori sitting on a ledge over Lady Bird Lake at sunset, with the words Not every apology arrives.' },
      ...L(`
The truth is, you cannot force morals, values, or self-awareness into somebody who isn’t interested in having them.
And waiting on someone else’s growth will keep your whole life on pause.
The longer I live, the more I understand that peace and closure aren’t the same thing.
Closure depends on somebody else doing the right thing.
Peace only depends on you.
That doesn’t mean you stop caring.
It doesn’t mean you pretend you weren’t hurt.
It doesn’t mean the relationship has to come back together.
It just means you stop handing someone else the remote control to your peace.
`),
      { t: 'quote', text: 'Stop letting people who won’t take accountability live rent-free in your head.' },
      ...L(`
Peace is something we can choose for ourselves.
Even when the apology never comes.
Even when the apology is hollow.
Even when the relationship never looks the same again.
And if you’re still waiting on an apology today, I hope you’ll give yourself permission to stop waiting. Not because they’ve earned your forgiveness, but because you’ve earned your peace.
`),
    ],
    take: 'Some apologies change everything.\n\nSome never come. And some aren’t worth the breath it took to say them.\n\nEither way, evict that situation from your head, protect your energy, and never put your healing on hold waiting for somebody else to act right. 💗',
    takeLabel: 'Tori’s Take',
    sources: [],
  },
  {
    slug: 'family-can-teach-you-patience',
    author: 'tori',
    lane: 'Tori’s Take',
    cardCover: '/blog/tori-family-patience.jpg',
    cover: { src: '/blog/tori-family-cover.jpg', alt: 'Illustration of Tori laughing at a big family dinner table with grandparents, parents and children' },
    title: 'Family Can Teach You Patience Like Nothing Else',
    dek: 'If you grew up in a big family, you probably already know where this is going.',
    date: '2026-11-13',
    body: [
      ...L(`
Growing up, our house was always full.
With four brothers, four sisters, and me, quiet wasn’t really an option.
Somebody was laughing.
Somebody was arguing.
And somebody was definitely eating something that didn’t belong to them.
If you grew up in a big family, you already know what it’s like to walk into the kitchen thinking about that leftover plate you saved, only to find an empty dish and nobody admitting who touched it. There were plenty of hangry moments in our house.
When there are nine kids under one roof, nothing is ever really just yours.
Not the bathroom.
Not the remote.
Not your space.
And definitely not your snacks.
At the time, it felt like pure chaos. Every single day felt like an adventure you didn’t necessarily sign up for.
Living with that many personalities forces you to learn things fast.
You learn how to compromise.
You learn how to speak up for yourself.
And most importantly?
You learn patience. A whole lot of patience.
`),
      { t: 'quote', text: 'Family will test your patience unlike anybody else.' },
      ...L(`
Every family has a mix of personalities.
The loud one.
The quiet one.
The stubborn one.
The peacemaker.
The one who’s somehow always right in the middle of everything.
The older I’ve gotten, the more I’ve realized that patience isn’t about pretending nobody gets on your nerves, or agreeing with everything they do.
It’s about learning how to love people even when they’re completely different from you.
Because as much as we drove each other crazy, growing up in a house that full came with something you can’t buy: a whole lot of love.
You never had to wonder if somebody had your back. You always had somebody to laugh with, somebody to lean on, and somebody who knew where you came from without you having to explain a word.
`),
      { t: 'img', src: '/blog/tori-family-scene.jpg', alt: 'Illustration of Tori from behind on the Lady Bird Lake trail at sunset, with a backpack that says Grateful for the chaos and the words Big families teach big lessons.' },
      ...L(`
Family teaches you that people communicate differently, show love differently, and handle life differently.
And whether we like it or not, there’s usually a lesson hidden somewhere inside all that noise.
Looking back, those years were a crash course in things you can’t learn from a book. How to read a room. How to wait your turn. How to let something small go because the bigger thing, the people, mattered more.
And honestly, I still use those lessons today. Whenever life asks me to be patient with someone, part of me is back in that crowded kitchen, taking a deep breath and remembering that everybody is just trying to be heard.
`),
      { t: 'quote', text: 'Nothing was ever really just yours, except the love that held everybody together.' },
      ...L(`
Some of my favorite memories came from moments that felt completely ordinary, or downright chaotic, at the time.
Crowded dinners.
Loud laughter.
Inside jokes nobody outside the house would ever understand.
Funny how that works. The things that drove us crazy back then are often the very things we laugh about now.
If you grew up with a full house, I hope you can look back and smile at the chaos too.
Big families will test every ounce of your patience.
But they’ll also fill your life with stories, resilience, and love you’ll carry forever.
`),
    ],
    take: 'Family isn’t always easy, especially when somebody ate your food and nobody’s confessing.\n\nBut if you’re paying attention, the people who test your patience the most are often the ones teaching you how to love the deepest.\n\nAnd trust me, with nine kids in one house, there were plenty of lessons to learn. 💗',
    takeLabel: 'Tori’s Take',
    sources: [],
  },
  // ---------------- Tori: Quick Tea ----------------
  {
    slug: 'steph-curry-ayesha-curry-comments',
    author: 'tori',
    lane: 'Tori Reacts',
    hero: true,
    cover: { src: '/blog/curry-hero.jpg', alt: 'Graphic: Steph Curry checks Nick Young and Gilbert Arenas over Ayesha Curry comments, with Tori’s take' },
    title: 'Steph Curry Isn’t Letting This One Slide',
    dek: 'He answered the podcasters who criticized Ayesha’s on-screen kiss.',
    date: '2026-11-12',
    body: [
      p('Steph Curry took to Instagram to defend his wife, Ayesha, and he kept it calm and pointed.'),
      p('Here’s what happened, per TheGrio and CBS Sports. Former players including Gilbert Arenas and Nick Young talked on a podcast about Ayesha’s on-screen kiss in her new holiday film, Second Chance Holiday. Arenas called her a “blemish” on the Curry family.'),
      p('Steph said the comments speak to a bigger conversation about how some men view women and what they’re allowed to do. His advice for next time: if Ayesha shows up in your headline, give her your congratulations.'),
      p('Nick Young apologized quickly. And Steph’s line stuck with me: “the apology can be as loud” as the shows that led with the topic.'),
      p('Also, acting is acting.'),
    ],
    take: 'I’m with Steph. There’s nothing wrong with Ayesha having a voice. Some of these men just sound like they want us back in the 80’s.',
    takeLabel: 'Tori’s Take',
    sources: [
      { name: 'TheGrio via Yahoo', url: 'https://www.yahoo.com/entertainment/celebrity/articles/steph-curry-checks-former-pro-004409404.html' },
      { name: 'CBS Sports', url: 'https://www.cbssports.com/nba/news/stephen-curry-wife-ayesha-curry-acting-gilbert-arenas-nick-young/' },
    ],
  },
  {
    slug: 'why-did-i-get-married-again',
    author: 'tori',
    lane: 'Quick Tea',
    cover: { src: '/blog/why-did-i-get-married-again.jpg', alt: 'Illustration of a wedding cake topped with two gold rings beside a bouquet of roses' },
    title: 'Why Did I Get Married Again?',
    dek: 'Tyler Perry got the band back together, and we’re about to be stressed.',
    date: '2026-11-12',
    body: [
      p('Now hold on.'),
      p('Because Tyler Perry done got the band back together and y’all know good and well we’re about to be stressed.'),
      p('The original Why Did I Get Married? had everybody arguing in living rooms, group chats, beauty salons and cookouts. Folks took sides, lost friendships, and suddenly became relationship experts overnight.'),
      p('And now we’re doing it again?'),
      p('My question isn’t who’s married.'),
      p('My question is what secrets are about to come out.'),
      p('Because Tyler Perry never brings people together just to let them be happy.'),
      p('One thing about Tyler, if everybody smiling in the first act, start praying.'),
    ],
    take: 'Somewhere an auntie already got her wine glass ready and an opinion nobody asked for.',
    takeLabel: 'Tori’s Take',
    sources: [{ name: 'The Root: Black films to look forward to', url: THEROOT }],
  },
  {
    slug: 'is-god-is',
    author: 'tori',
    lane: 'Quick Tea',
    cover: { src: '/blog/is-god-is.jpg', alt: 'Illustration of an open door with golden light streaming into a dark room' },
    title: 'Is God Is',
    dek: 'The title sounds spiritual. Everybody isn’t headed to church.',
    date: '2026-11-12',
    body: [
      p('Baby.'),
      p('The cast alone has my attention.'),
      p('You got Janelle Monáe. You got Sterling K. Brown. And if you’ve seen the stage play, then you already know this ain’t one of those sit-back-and-fold-laundry movies.'),
      p('This is revenge.'),
      p('This is family drama.'),
      p('This is trauma in a trench coat.'),
      p('The title sounds spiritual but don’t be fooled. Everybody isn’t headed to church.'),
      p('Some folks are headed to settle scores.'),
    ],
    take: 'I don’t know what’s about to happen, but I know somebody’s peace is getting disturbed.',
    takeLabel: 'Tori’s Take',
    sources: [{ name: 'The Root: Black films to look forward to', url: THEROOT }],
  },
  {
    slug: 'jumanji-3',
    author: 'tori',
    lane: 'Quick Tea',
    cover: { src: '/blog/jumanji-3.jpg', alt: 'Illustration of a mysterious game board on a stone pedestal in a jungle with an elephant and giraffe' },
    title: 'Jumanji 3',
    dek: 'Nobody learns lessons in the Jumanji universe, and we’ll still be there opening weekend.',
    date: '2026-11-12',
    body: [
      p('At this point I’m convinced nobody learns lessons in the Jumanji universe.'),
      p('Every movie starts the same way.'),
      p('A mysterious game appears.'),
      p('Someone says don’t touch it.'),
      p('Somebody touches it.'),
      p('Then everybody spends two hours fighting for their lives.'),
      p('And somehow we’re all seated opening weekend.'),
    ],
    take: 'If I see a magical board game in real life, I’m minding my business and going home.',
    takeLabel: 'Tori’s Take',
    sources: [{ name: 'Box Office Mojo release calendar', url: BOM }],
  },
  {
    slug: 'hunger-games-sunrise-on-the-reaping',
    author: 'tori',
    lane: 'Quick Tea',
    cover: { src: '/blog/hunger-games-sunrise-on-the-reaping.jpg', alt: 'Illustration of a large arena at sunset with a bird flying over the crowd' },
    title: 'The Hunger Games: Sunrise on the Reaping',
    dek: 'Panem needs therapy, and we’re still buying tickets.',
    date: '2026-11-12',
    body: [
      p('Can we all agree that Panem needs therapy?'),
      p('Because every few years they find a new way to traumatize children and somehow we keep buying tickets.'),
      p('But let’s be honest.'),
      p('We’re gonna watch.'),
      p('The Hunger Games hasn’t missed yet.'),
      p('The odds may never be in your favor, but the casting department stays employed.'),
    ],
    take: 'If my city picked kids by lottery for anything, I’m moving immediately.',
    takeLabel: 'Tori’s Take',
    sources: [{ name: 'Box Office Mojo release calendar', url: BOM }],
  },

  // ---------------- Caleb's Corner ----------------
  {
    slug: 'nvidia-ceo-jensen-huang-steps-down',
    author: 'caleb',
    lane: 'Caleb Reports',
    topic: 'AI & Tech',
    hero: true,
    cover: { src: '/blog/nvidia-ceo-steps-down.jpg', alt: 'Cover graphic: Nvidia CEO Jensen Huang steps down, with Colette Kress named interim CEO' },
    photoCredit: { by: 'Anderseidesvik', via: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/wiki/File:Jensen_huang_stanford_2026-04-30_029.jpg', license: 'CC BY-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/', changes: 'cropped and blurred' },
    title: 'Nvidia CEO Jensen Huang Steps Down. Here’s What It Means for the AI Boom',
    dek: 'Colette Kress is interim CEO, and earnings are still set for Nov. 17. Here’s what to watch.',
    date: '2026-11-12',
    body: [
      h('What’s Hot'),
      p('Nvidia announced Thursday that Jensen Huang has resigned as CEO, president and board member, effective immediately. Chief Financial Officer Colette Kress becomes interim CEO and keeps her CFO role while the board searches for a permanent successor, internal or external. Harvey C. Jones was named the company’s first-ever board chair. Nvidia did not give a reason for the departure.'),
      p('It follows a week of pressure. On Nov. 8, Huang acknowledged an extramarital affair in a letter, and the board opened an independent investigation into reports that he had been the target of a foreign intelligence effort. The board said it had no reason to believe national security or Nvidia secrets were compromised. Shares closed down about 4.3% on Monday, wiping out almost $200 billion in value, according to Sky News. Nvidia says it will still report earnings Tuesday, Nov. 17, and that its product roadmap won’t be interrupted.'),
      h('Why You Should Care'),
      p('Nvidia makes the chips behind ChatGPT, Google’s Gemini and much of the AI boom, and Huang built the company. Before the news, Bernstein analyst Stacy Rasgon said “he is Nvidia.” When the person at the center of the most important company in AI leaves overnight, investors have to guess how strategy, pricing and China sales will change. Many retirement accounts and index funds hold Nvidia, so this reaches people who have never bought a chip stock.'),
      h('The Austin Angle'),
      p('Austin’s tech economy runs on the AI boom, from startups to the data centers and chip plants coming to Central Texas. If the leadership change slows AI spending or shakes investor confidence, that can show up in hiring, funding and construction here. If Nvidia stays steady under Kress, it likely won’t. Tuesday’s earnings report is the first real signal.'),
      h('Caleb’s Takeaway'),
      p('One person leaving doesn’t end the AI boom. But it does answer a question the market has been avoiding: was Nvidia’s lead built by a company or by a founder? Jensen set the strategy and pulled most of the strings himself, and now someone else has to pull them. Colette Kress knows the numbers better than almost anyone, which helps. Tuesday’s earnings call is the first real test of whether the machine runs without him. I’d watch what she says, not just what the stock does.'),
    ],
    take: 'One person leaving doesn’t end the AI boom. The question is whether Nvidia’s lead was built by a company or by a founder.',
    takeLabel: 'Caleb’s Take',
    sources: [
      { name: 'Nvidia press release (Nov 12, 2026)', url: 'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-CEO-Transition/default.aspx' },
      { name: 'Yahoo Finance', url: 'https://finance.yahoo.com/technology/articles/jensen-huang-resigns-nvidia-ceo-155953722.html' },
      { name: 'Sky News (Nov 10, 2026)', url: 'https://news.sky.com/story/fbi-to-investigate-nvidia-ceo-over-affair-with-alleged-chinese-spy-trump-says-13610382' },
    ],
    note: 'General information only, not financial advice.',
  },
  {
    slug: 'outlook-email-blocked-small-business',
    author: 'caleb',
    lane: 'Caleb Reports',
    cover: { src: '/blog/auth-failed.jpg', alt: 'A laptop screen showing an “Authentication Failed” error message' },
    photoCredit: { by: 'Pexels', via: 'Pexels', url: 'https://www.pexels.com/license/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', changes: 'cropped' },
    topic: 'Cybersecurity',
    title: 'Outlook Blocked Real Email for Three Days. Here’s the Lesson for Small Businesses',
    dek: 'It wasn’t a new rule. It was a Microsoft mistake. Here’s what it means for your business email.',
    date: '2026-11-12',
    body: [
      h('What’s Happening'),
      p('From about November 6 to November 9, some email sent to Outlook.com, Hotmail and Live addresses bounced with a message saying it lacked SPF, DKIM or DMARC records. Many business owners, and some email companies, assumed Microsoft had quietly started requiring DMARC from every sender.'),
      p('Microsoft’s own incident report (EX1545193) says that’s not what happened. Microsoft says a recent update to its spam enforcement rules wrongly marked and blocked legitimate mail. The incident is listed as restored, with impact ending November 9 at 11:02 UTC.'),
      h('Why It Matters'),
      p('Most business owners never think about email authentication. They think about customers, invoices, appointments and newsletters. But email is the backbone of a small business, and when it fails you often don’t see it fail.'),
      p('Mail that Outlook.com refused was not retried, so the person on the other end never knew it was sent. If an invoice, a quote or a reply bounced last week, send it again.'),
      h('What It Means For Austin'),
      p('Austin is full of Black-owned, Latino-owned and family-owned businesses, side hustlers, creators and nonprofits. A roofing company sending quotes, a realtor sending contracts, a church sending its newsletter: many of them use a custom domain and have never heard the word DMARC.'),
      p('There’s no new requirement for small senders. Bulk senders, meaning high-volume senders, still do need to authenticate their mail. Adding a basic DMARC record is cheap and a good first step.'),
      h('Caleb’s Take'),
      p('This one was Microsoft’s mistake, but it works as a fire drill. The businesses that win over the next few years will treat cybersecurity like electricity. You don’t need to become an expert, but you do need the basics set up before they become a problem. Check that your email is authenticated, resend anything important that bounced, and ask whoever runs your email what would happen if it failed for a day.'),
    ],
    take: 'Treat cybersecurity like electricity: set up the basics before they become a problem.',
    takeLabel: 'Caleb’s Take',
    sources: [
      { short: 'Microsoft 365 incident report', name: 'Microsoft incident EX1545193, as republished by Penn (University of Pennsylvania)', url: 'https://mailservices.isc.upenn.edu/computing/email/penno365/alerts/ms-incidents.html' },
      { name: 'MailRoute: Outlook.com’s DMARC Rejections, What Microsoft Said (Nov 10, 2026)' },
    ],
    note: 'Penn’s page shows only the last 30 days of Microsoft notices, so the incident will eventually drop off it.',
  },
  {
    slug: 'nominal-3-billion-valuation-austin',
    author: 'caleb',
    lane: 'Caleb Reports',
    cover: { src: '/blog/nominal-lab.jpg', alt: 'Hands holding a circuit board over electronics test equipment in a lab' },
    photoCredit: { by: 'Pexels', via: 'Pexels', url: 'https://www.pexels.com/license/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', changes: 'cropped' },
    topic: 'Business & Growth',
    title: 'Nominal Hits a $3 Billion Valuation. Who Shares in the Growth?',
    dek: 'The hardware-testing startup raised $240 million. The harder question is who benefits locally.',
    date: '2026-11-12',
    body: [
      h('What’s Happening'),
      p('Nominal, a software company that helps engineers test hardware like aircraft, satellites and robots, announced a $240 million Series C on November 9 at a $3 billion valuation. That’s triple its $1 billion valuation from March. Lightspeed led the round, with Insight Partners co-leading, according to The Next Web.'),
      h('Why It Matters'),
      p('People often assume innovation only happens in Silicon Valley. That’s increasingly outdated. Austin keeps producing and attracting companies that draw national attention, investors and talent. Nominal counts Austin among its home bases, though reports differ on whether its headquarters is here or in Los Angeles.'),
      h('What It Means For Austin'),
      p('A growing startup ecosystem can mean more high-paying jobs, more investment, more entrepreneurs and more economic activity. The downside is more competition for housing and talent. Austin’s success often creates both opportunity and growing pains.'),
      h('Caleb’s Take'),
      p('Every time an Austin startup becomes a billion-dollar company, the headline is about the money raised. The better question is whether local residents share in that growth or get priced out by it. Jobs, supplier work, and training programs that reach beyond the usual hiring pipeline are how a valuation turns into something a neighbor can feel. Watch for those, not just the number.'),
    ],
    take: 'The question isn’t how much money was raised. It’s whether local residents share in the growth or get priced out by it.',
    takeLabel: 'Caleb’s Take',
    sources: [{ name: 'The Next Web: Nominal raises $240M at $3B', url: 'https://thenextweb.com/news/nominal-series-c-240m-3b-valuation-hardware-ai' }],
    note: 'General information only, not financial advice.',
  },
  {
    slug: 'samsung-taylor-chip-plant',
    author: 'caleb',
    lane: 'Caleb Reports',
    cover: { src: '/blog/samsung-taylor-plant.jpg', alt: 'Illustration of a large chip plant under construction with cranes on open Central Texas land' },
    photoCredit: { by: 'Illustration', via: 'AI', url: '', license: '', licenseUrl: '', changes: '' },
    topic: 'Business & Growth',
    title: 'Samsung’s Taylor Chip Plant Is Getting Close. Here’s Why Austin Should Care',
    dek: 'Trial runs could start as soon as December. This is a Central Texas story, not just a Taylor story.',
    date: '2026-11-12',
    body: [
      h('What’s Happening'),
      p('Samsung’s semiconductor plant in Taylor, Texas, is preparing for trial runs. Industry sources cited by The Korea Herald say they could begin in mid-to-late December. Samsung has not confirmed a date. Mass production is planned for 2027.'),
      h('Why It Matters'),
      p('Most people never think about where computer chips come from. They should. Chips power phones, cars, AI systems, medical equipment and appliances. Semiconductors have become one of the most important industries in the world.'),
      h('What It Means For Austin & Round Rock'),
      p('The effects reach well past Taylor. Potential impacts include more engineering and construction jobs, supplier growth, population growth, housing pressure and new business development. For many families in Williamson County, it could mean career opportunities much closer to home.'),
      h('Caleb’s Take'),
      p('For years Austin has been known for software, startups and music. Chips and advanced manufacturing add a different kind of strength: the kind that needs trained workers, suppliers, housing and roads. This isn’t just a Taylor story. It’s a Central Texas story. The corridor between Austin, Round Rock, Georgetown and Taylor is becoming one of the country’s most important technology regions, and the region’s job now is to be ready for it.'),
    ],
    take: 'This isn’t just a Taylor story. It’s a Central Texas story.',
    takeLabel: 'Caleb’s Take',
    sources: [{ name: 'Asianet Newsable, citing The Korea Herald (Nov 9, 2026)', url: 'https://newsable.asianetnews.com/business/samsung-gears-up-for-trial-runs-at-its-new-taylor-texas-chip-plant-articleshow-wdxuibg' }],
  },
  {
    slug: 'hidden-cost-of-the-ai-boom-texas-data-centers',
    author: 'caleb',
    lane: 'Caleb Reports',
    cover: { src: '/blog/cyber-racks.jpg', alt: 'A long aisle of server racks inside a data center' },
    photoCredit: { by: 'Pexels', via: 'Pexels', url: 'https://www.pexels.com/license/', license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/', changes: 'cropped' },
    topic: 'AI & Tech',
    title: 'The Hidden Cost of the AI Boom: What Texas Data Centers Mean for Your Bill',
    dek: 'Texas officials still don’t know exactly how much water and power data centers use.',
    date: '2026-11-12',
    body: [
      h('What’s Happening'),
      p('KUT reported in August that Texas officials don’t know exactly how much water data centers use. The Public Utility Commission sent a survey this year, and fewer than a third of the state’s 341 data centers responded. Data centers use less than 1% of the state’s water today, but estimates for 2030 are far higher.'),
      p('On power, ERCOT had requests for more than 400,000 megawatts of new demand as of April, and about 89% of it came from data center developers. KUT also noted that Texas retail electricity prices have risen 29% since 2020, though the report doesn’t blame data centers alone.'),
      h('Why It Matters'),
      p('Every AI chatbot, every AI image and every AI-generated video runs inside a data center somewhere. Most people see the software. They don’t see the power bill.'),
      h('What It Means For Austin'),
      p('Texas is becoming a major destination for data centers, cloud infrastructure and AI computing. That brings jobs and investment. It also raises questions: who pays for grid upgrades, will energy costs rise, how much water gets used, and how much land is consumed?'),
      h('Caleb’s Take'),
      p('Everybody loves AI until the power bill arrives. The AI boom isn’t free, and the real debate isn’t whether it’s coming. It’s whether communities get enough benefit in return for the costs they’re being asked to absorb. Better data would help. You can’t judge a trade-off nobody has measured, and right now the state is still counting.'),
    ],
    take: 'The AI boom isn’t free. The question is whether communities get enough in return for the costs they absorb.',
    takeLabel: 'Caleb’s Take',
    sources: [{ name: 'KUT 90.5: Texas data centers and water and power use (Aug 5, 2026)', url: 'https://www.kut.org/energy-environment/2026-08-05/texas-data-centers-water-power-energy-use-environment' }],
  },
  {
    slug: 'helping-older-adults-stay-safe-online',
    author: 'caleb',
    lane: 'Guide',
    related: ['fake-toll-text-scams-texas'],
    topic: 'Cybersecurity',
    cover: { src: '/blog/caleb-corner-older-adults.jpg', alt: 'Illustration of Caleb for helping-older-adults-stay-safe-online' },
    title: 'Helping Older Adults Stay Safe Online: Warning Signs and What to Do',
    dek: 'Older adults are common targets for scams. Here are the warning signs, and the simple steps that help.',
    date: '2026-11-13',
    body: [
      p('Almost everyone has a parent, grandparent or neighbor who gets calls and texts that sound urgent. The internet is not the problem. The scammers who use it are. The good news is that most scams share the same few warning signs, and a few habits stop most of them.'),
      h('Warning signs'),
      { t: 'list', items: [
        'Pressure. Scammers use fear, urgency or trust, and offers that expire fast.',
        'A family emergency. Someone claims to be a grandchild or relative who is arrested, hurt or stranded, and asks for money right away, sometimes insisting you keep it secret.',
        'Gift cards and wire transfers. A real company will not ask you to pay with gift cards. Tech support and romance scammers often do.',
        'Scary pop-ups or unexpected calls saying your computer has a problem.',
        'Someone posing as Medicare who offers “free” products or pushes you toward a plan. Treat your Medicare number like a credit card number.',
        'A new online friend who seems too perfect, rushes the relationship, moves the conversation off the dating site, or keeps canceling in-person meetings.',
        'A door-to-door worker with a “special deal” or an urgent problem with your home.',
      ] },
      h('What helps'),
      { t: 'list', items: [
        'Slow down. A real emergency can survive a five-minute pause.',
        'Hang up, then call back using a number you already trust, such as the one on a card or a past bill. Do not use the number the caller gives you.',
        'Ask a question only the real person would know.',
        'Get offers and contract terms in writing. Do not sign or pay under pressure.',
        'Check Medicare statements to make sure you actually received what was billed. Never sign blank insurance claim forms.',
        'Do not click links in unexpected texts or emails. See our article on fake toll texts for a common example.',
      ] },
      h('If something already happened'),
      { t: 'list', items: [
        'Tell your bank or card company right away.',
        'File a report with your local police.',
        'Report it to the FTC at reportfraud.ftc.gov and to the FBI’s Internet Crime Complaint Center at ic3.gov.',
        'For Medicare fraud, call 1-800-MEDICARE.',
        'The Eldercare Locator, at 1-800-677-1116, can connect you with Adult Protective Services in your area.',
      ] },
      h('Talk about it before it happens'),
      p('The best protection is a conversation. Tell the people you care about that you will never be upset if they check with you first, and that a quick “is this real?” text is always welcome. Scams work best when people feel too embarrassed to ask.'),
    ],
    take: '',
    takeLabel: '',
    sources: [
      { name: 'National Council on Aging: Scam warning signs every older adult should know', url: 'https://www.ncoa.org/article/scam-warning-signs-every-older-adult-should-know-and-tips-to-stay-protected/' },
      { name: 'Federal Trade Commission: report fraud', url: 'https://reportfraud.ftc.gov/' },
      { name: 'FBI Internet Crime Complaint Center', url: 'https://www.ic3.gov/' },
    ],
    note: 'Last checked Nov. 13, 2026. General information only. Phone numbers and programs can change.',
  },
  {
    slug: 'cybersecurity-basics-for-austin-families',
    author: 'caleb',
    lane: 'Caleb’s Corner',
    topic: 'Cybersecurity',
    cover: { src: '/blog/caleb-corner-families.jpg', alt: 'Illustration of Caleb for cybersecurity-basics-for-austin-families' },
    title: 'Cybersecurity Basics for Austin Families: Four Habits That Do the Most Good',
    dek: 'You do not need to be technical. Four habits from the federal cybersecurity agency cover most of what keeps families safe.',
    date: '2026-11-13',
    body: [
      p('Cybersecurity can sound like a job for experts. For most families, it comes down to a few habits. The federal Cybersecurity and Infrastructure Security Agency (CISA) boils it down to four, and they work for a household of any size.'),
      h('1. Spot and report phishing'),
      p('Phishing is a message that tries to trick you into clicking, sharing information or paying. Watch for alarming language and offers that seem too good to be true. Do not click or reply. Report it, then delete it.'),
      h('2. Use strong, unique passwords'),
      p('CISA recommends passwords that are at least 16 characters long, random, and different for every account. Nobody can remember that many, so use a password manager to create them, store them and fill them in for you.'),
      h('3. Turn on multifactor authentication'),
      p('Multifactor authentication (MFA) adds a second step after your password, like a face scan or a code sent to your phone. Turn it on everywhere it is offered, starting with email, banking and social media. It makes your accounts much harder to break into.'),
      h('4. Keep your software updated'),
      p('Updates fix security bugs. Install them on your phones, computers, apps and security software as soon as they are available, or turn on automatic updates so you do not have to remember.'),
      h('Where to start this weekend'),
      { t: 'list', items: [
        'Pick one password manager and move your email and banking passwords into it first.',
        'Turn on MFA for your email account. If someone gets into your email, they can reset almost everything else.',
        'Switch on automatic updates on every device in the house.',
        'Teach everyone, including kids and grandparents, to stop before clicking on a link they were not expecting.',
      ] },
    ],
    take: '',
    takeLabel: '',
    sources: [
      { name: 'CISA: Secure Our World, 4 easy ways to stay safe online (tip sheet)', url: 'https://www.cisa.gov/sites/default/files/2024-09/Secure-Our-World-4-Easy-Ways-Stay-Safe-Online-Tip-Sheet.pdf' },
    ],
    note: 'Last checked Nov. 13, 2026. General information only.',
  },
  {
    slug: 'flood-ready-travis-williamson-counties',
    author: 'localbuzz',
    lane: 'Guide',
    topic: 'Safety',
    title: 'Flood-Ready in Travis and Williamson Counties: A Checklist and a City-by-City Guide',
    dek: 'One checklist for your phone, home and car, then local links and numbers for Austin, Round Rock, Georgetown and Hutto.',
    date: '2026-11-13',
    body: [
      p('Heavy rain and flood warnings have been in the news across Central Texas this month. Getting ready takes about an hour, and most of it is free. This guide starts with a checklist that works anywhere in Travis and Williamson counties, then lists the local links and numbers for Austin, Round Rock, Georgetown and Hutto.'),
      h('Step 1: Get alerts on your phone'),
      { t: 'list', items: [
        'Register at WarnCentralTexas.org for emergency alerts by phone, text or email. It serves Travis, Williamson and eight other Central Texas counties, and the Capital Area Council of Governments runs it.',
        'Check that emergency alerts are turned on in your phone settings.',
        'Know the difference between a Flash Flood Watch (flooding is possible in the next 36 hours) and a Flash Flood Warning (flash flooding is imminent, usually within one to three hours).',
      ] },
      h('Step 2: Build a digital go-bag'),
      p('If you have to leave fast, you want your paperwork with you and safe at the same time. The City of Austin suggests keeping important documents in a watertight container and making password-protected digital copies.'),
      { t: 'list', items: [
        'Photograph or scan IDs, insurance policies, your lease or deed, and key medical papers. Save the copies in two places: on your phone and in a protected cloud folder.',
        'Take a quick photo tour of each room. It makes an insurance claim much easier.',
        'Keep a charged power bank and a car phone charger together in your kit.',
        'Write down a few key phone numbers on paper, in case your phone dies.',
        'After a flood, be careful with strangers who call, text or knock offering repairs or aid. Check any company before you pay or share information.',
      ] },
      h('Step 3: Make a plan for your home and family'),
      { t: 'list', items: [
        'Pack a kit with food, water, medications, first-aid supplies and pet supplies. Ready.gov suggests a gallon of water per person per day.',
        'Decide where your family will meet, and whether you would stay home or go to a shelter. Include your pets in the plan.',
        'Learn how to shut off your gas, water and electricity.',
        'Keep drains and gutters clear, and move valuables to a higher level of your home.',
      ] },
      h('Step 4: On the road'),
      p('Never drive through water flowing over a road, and never go around a barricade. Round Rock’s flood safety page says about six inches of moving water can knock you down and about two feet can carry away a vehicle. If water is rising around your car but not moving, leave the car and go to higher ground.'),
      { t: 'list', items: [
        'Check ATXFloods.com/closures for road and low-water crossing closures across Central Texas, and DriveTexas.org for state road conditions.',
        'Keep your gas tank at least half full during storm season. Travis County recommends it.',
        'Keep a vehicle kit with jumper cables, a reflective triangle or flares, a phone charger, and cat litter or sand.',
        'Call 911 for emergencies.',
      ] },
      h('Step 5: After the water'),
      { t: 'list', items: [
        'Go home only when authorities say it is safe.',
        'If you smell gas, leave and call the fire department.',
        'Photograph the damage for your insurance company.',
      ] },
      h('Find your city'),
      p('The steps above are the same everywhere. The phone numbers, utilities and local tools are not. Here is what each place publishes.'),
      h('Austin (Travis County)'),
      { t: 'list', items: [
        'Austin Energy: text REG to 287846 to register for outage alerts, and text OUT to 287846 to report an outage.',
        'Austin Water: sign up for the My ATX Water portal. The 24-hour hotline is 512-972-1000, option 1.',
        'Road closures and preparedness tips: ATXFloods.com and ATXFloodSafety.com. Report flooding or debris through the Austin 311 app, or call 311.',
        'Emergency repair permits after a flood: austintexas.gov/emergency-permits.',
        'Free training: Austin Emergency Management is holding an online flood preparedness training on Tuesday, Nov. 17, at 5:30 p.m. Austin Watershed Protection staff will speak. Spanish and American Sign Language interpretation is available. Registration is on the city’s page, linked below.',
      ] },
      h('Travis County outside the city limits'),
      { t: 'list', items: [
        'Follow Travis County Emergency Services on Facebook and X (@TravisCountyES) for updates.',
        'For non-emergency weather damage reporting and information, call 311, per the county’s preparedness page.',
      ] },
      h('Round Rock'),
      { t: 'list', items: [
        'The city’s Flood Safety page explains watches and warnings and the “Turn Around, Don’t Drown” message.',
        'Round Rock Fire Department: 512-218-5590. City of Round Rock: 512-218-5400. Emergencies: 911.',
        'Local weather: the National Weather Service Austin/San Antonio office at weather.gov/ewx.',
      ] },
      h('Georgetown'),
      { t: 'list', items: [
        'Water and electric outages show on the city’s outage map at gus.georgetown.org/outages. In a 2022 notice, the city said that if an outage is not on the map, you can call 512-930-3640 from the phone number on your account. Check that this is still the right number before you rely on it.',
        'In that same notice, the city named areas that need caution in heavy rain, including parts along the San Gabriel River and Lake Georgetown, such as trail crossings and low bridges.',
        'City social media is not monitored around the clock, so call 911 for emergencies.',
      ] },
      h('Hutto'),
      { t: 'list', items: [
        'Hutto Fire Rescue: 512-759-2616, or info@huttofire.gov. Emergencies: 911.',
        'Hutto Fire Rescue publishes a Community Flood Protection Plan, developed with the Williamson County Office of Emergency Management and other regional partners. The PDF is on its Community Services page.',
      ] },
      h('Williamson County'),
      { t: 'list', items: [
        'Williamson County urges residents to register for alerts at WarnCentralTexas.org, and to check atxfloods.com for closed roads before driving.',
        'If you live near a creek or flood plain, be ready to leave if water levels keep rising.',
      ] },
    ],
    take: '',
    takeLabel: '',
    sources: [
      { name: 'City of Austin: Flooding Preparedness', url: 'https://www.austintexas.gov/ready-central-texas/flooding-preparedness' },
      { name: 'Austin Emergency Management: free flood preparedness training (Nov. 17)', url: 'https://www.austintexas.gov/emergency-management/news/austin-emergency-management-host-free-flood-preparedness-training' },
      { name: 'Travis County: Emergency Preparedness', url: 'https://www.traviscountytx.gov/emergency/preparedness' },
      { name: 'City of Round Rock: Flood Safety', url: 'https://www.roundrocktexas.gov/city-departments/fire/homeland-security-and-emergency-management/flood-safety/' },
      { name: 'Williamson County: residents urged to sign up for alerts', url: 'https://www.wilco.org/meetings/residents-urged-to-sign-up-for-alerts-watch-for-flooding' },
      { name: 'City of Georgetown: flood watch notice (Aug. 2022)', url: 'https://georgetown.org/?p=47693' },
      { name: 'Hutto Fire Rescue: Community Services', url: 'https://huttofire.gov/community-services/' },
      { name: 'NPR: What to do in a flash flood (July 2025)', url: 'https://www.npr.org/2025/07/10/nx-s1-5463523/flash-flood-safety-tips-what-to-know' },
      { name: 'National Weather Service: Flood Safety', url: 'https://www.weather.gov/safety/flood' },
      { name: 'Ready.gov', url: 'https://www.ready.gov/' },
    ],
    note: 'Last checked Nov. 13, 2026. General information only. Phone numbers and programs can change, so confirm with your city or county. In an emergency, follow instructions from local officials and call 911.',
  },
  {
    slug: 'fake-toll-text-scams-texas',
    author: 'caleb',
    lane: 'Caleb’s Corner',
    related: ['helping-older-adults-stay-safe-online'],
    topic: 'Cybersecurity',
    title: 'Got a Text About an Unpaid Toll? How to Spot the Scam in Texas',
    dek: 'Fake toll texts keep showing up on Texas phones. Here is how to spot one, what to do, and where to report it.',
    date: '2026-11-13',
    body: [
      p('You get a text saying you owe a toll balance. There is a link, and a warning that a late fee is coming if you do not pay. It looks official. It is a scam. The FBI has warned about these texts, and TxDOT has been warning Texas drivers about fake TxTag messages since 2024.'),
      h('How the scam works'),
      p('This kind of attack is called smishing: a fake text message that tries to get you to click. The link leads to a website made to look like a toll service, such as TxTag or the Central Texas Mobility Authority. The goal is to steal your card number or personal information, or to get malware onto your phone.'),
      h('Signs a toll text is fake'),
      { t: 'list', items: [
        'You were not expecting it, and it comes with a link.',
        'It pushes you to act fast and threatens a late fee.',
        'It says you owe a balance, and you may not even use toll roads.',
        'It claims to be from TxTag about a final payment reminder or a past-due balance. TxTag says it does not send texts about those.',
        'It claims to be from the Central Texas Mobility Authority and lists a balance. The Mobility Authority says its texts do not list balances or ask for personal information.',
      ] },
      p('TxTag says its real texts come from short code 22498, and only go to customers who opted in, at the phone number on their account.'),
      h('What to do'),
      { t: 'list', items: [
        'Do not click the link, and do not reply.',
        'Do not call any phone number in the text.',
        'If you think you might owe a toll, check your account yourself. Type the toll agency’s website into your browser, or use the number printed on your account paperwork.',
        'Delete the text.',
      ] },
      h('Report it'),
      { t: 'list', items: [
        'The Federal Trade Commission: reportfraud.ftc.gov. TxDOT asks people to use the organization code TXDOT.',
        'Your phone carrier: forward the text to 7726 (SPAM). The FTC says this helps carriers block similar texts.',
        'The FBI’s Internet Crime Complaint Center: ic3.gov. Include the phone number and website from the text.',
      ] },
      h('If you already clicked or paid'),
      { t: 'list', items: [
        'Call your bank or card company, and dispute any charge you do not recognize.',
        'Keep watching your accounts for unfamiliar activity.',
        'If you typed a password anywhere, change it on the real site, and on any other site where you use the same one.',
      ] },
      h('Tell someone else'),
      p('These texts work best on people who are busy or who do not see many scams. Send this page to a parent, a grandparent or a coworker. A thirty-second warning can save them a bad week.'),
    ],
    take: '',
    takeLabel: '',
    sources: [
      { name: 'TxDOT: warning about texting scams targeting TxTag customers', url: 'https://www.txdot.gov/about/newsroom/statewide/2024/txdot-warning-drivers-of-spike-in-texting-scams-targeting-txtag-customers.html.html' },
      { name: 'KCEN: FBI warning about toll road text scams in Texas', url: 'https://www.kcentv.com/article/news/local/toll-road-text-scam-texas-fbi-warning/269-c01f7724-2bfc-4194-a4ef-ab6fcfc19ead' },
      { name: 'FBI Internet Crime Complaint Center: public service announcement (April 2024)', url: 'https://www.ic3.gov/Media/Y2024/PSA240412' },
      { name: 'Central Texas Regional Mobility Authority: alert about a smishing scam (July 2024)', url: 'https://www.mobilityauthority.com/resources/releases/mobility-authority-alerts-customers-of-new-smishing-scam/' },
      { name: 'Federal Trade Commission: how to recognize and report spam text messages', url: 'https://consumer.ftc.gov/articles/how-recognize-and-report-spam-text-messages' },
      { name: 'Federal Trade Commission: report fraud', url: 'https://reportfraud.ftc.gov/' },
    ],
    note: 'Last checked Nov. 13, 2026. General information only. Scam wording changes often, so when in doubt, go to the company’s real website yourself.',
  },
  {
    slug: 'speak-at-austin-city-council',
    author: 'localbuzz',
    lane: 'Guide',
    topic: 'Civic life',
    title: 'How to Speak at an Austin City Council Meeting',
    dek: 'Two ways to speak, the deadlines to know, and how to send written comments instead.',
    date: '2026-11-13',
    body: [
      p('Austin City Council meetings are open to public comment. You can talk about something that is not on the agenda, or you can speak about a specific item the Council is voting on. This guide covers the City of Austin’s process. Other cities, including Round Rock, Georgetown and Hutto, have their own rules.'),
      h('Option 1: General communication (noon)'),
      p('This is for topics that are not on the agenda.'),
      { t: 'list', items: [
        'Up to 10 speakers per regular meeting, three minutes each.',
        'You can speak once every three regular Council meetings. Time cannot be donated.',
        'You must register in advance with the City Clerk’s Office. You can do it online, by phone at 512-974-2210, or in person at Suite 2030 in City Hall, 301 W. 2nd Street.',
        'Registration opens at 9 a.m. 21 days before the meeting and closes at 4:30 p.m. 14 days before. The City publishes a General Public Communication Schedule with the dates.',
        'Your registration needs the meeting date, your name, contact information, and whether you will speak in person or remotely.',
      ] },
      h('Option 2: Speak on an agenda item'),
      p('You can speak in person or by phone on an item the Council is considering.'),
      { t: 'list', items: [
        'Online registration opens at 10 a.m. on the Monday before a regular meeting and closes at noon the day before. Remote speakers get an email with instructions after registration closes.',
        'In-person registration at City Hall uses kiosks in the atrium. It opens shortly after noon the day before and closes 45 minutes before the meeting starts.',
        'Consent agenda comment begins at 10 a.m. Public hearings and other items follow. Zoning items begin at 2 p.m.',
        'Each speaker gets at least two minutes per item, and you can register to speak on an item once. In-person speakers can receive donated time from up to two other in-person speakers. Coordinate that with Clerk staff before the item is called.',
        'If you speak remotely, find a spot with good cell reception. Wireless calls can drop.',
      ] },
      h('Prefer to write?'),
      p('You can email handouts or documents to city.clerk@austintexas.gov by 5 p.m. the day before the meeting. They go to the Mayor and Council in advance.'),
      h('Need an interpreter?'),
      p('You can request language interpretation or sign language services. Email city.clerk@austintexas.gov at least 48 hours before the meeting.'),
      h('A few tips'),
      { t: 'list', items: [
        'Check the agenda first, so you know which item you are speaking on.',
        'Lead with your point. Two or three minutes goes fast.',
        'Say who you are and where you live, then what you want the Council to do.',
        'Questions? Call the City Clerk at 512-974-2210.',
      ] },
    ],
    take: '',
    takeLabel: '',
    sources: [
      { name: 'City of Austin: Participate in a City Council meeting', url: 'https://www.austintexas.gov/participate' },
      { name: 'City of Austin: Council Meeting Information Center', url: 'https://www.austintexas.gov/department/city-council/council/council_meeting_info_center.htm' },
      { name: 'City of Austin: 2026 General Public Communication Schedule', url: 'https://www.austintexas.gov/department/city-council/council/2026_general_communication_schedule.htm' },
    ],
    note: 'Last checked Nov. 13, 2026. General information only. Deadlines and rules can change, so confirm with the City Clerk before you plan to speak.',
  },
  {
    slug: 'travis-county-property-tax-bill-who-gets-what',
    author: 'localbuzz',
    lane: 'Guide',
    topic: 'Money',
    title: 'Your Travis County Property Tax Bill: Who Gets What',
    dek: 'Five local governments share a typical Austin homeowner’s bill. Here is the split, and what changed this year.',
    date: '2026-11-13',
    body: [
      p('If you own a home in Austin, your property tax bill is not just a city bill. Several local governments share it. This guide covers homeowners in the Austin ISD part of Travis County, using figures reported by Community Impact for the 2026 tax year. If you live in Round Rock, Georgetown, Hutto or another school district, your bill will be different.'),
      h('Who gets the money'),
      p('For a home valued at about $500,000, Community Impact reports a bill of roughly $8,215 a year across five taxing entities. The approximate shares:'),
      { t: 'list', items: [
        'Austin ISD: about 40%.',
        'City of Austin: about 28%.',
        'Travis County: about 19%.',
        'Central Health: about 6%.',
        'Austin Community College: about 6%.',
      ] },
      h('What changed in 2026'),
      { t: 'list', items: [
        'The City of Austin adopted a rate of $0.579948 per $100 of taxable value on Aug. 12, up from $0.524017. For the median homeowner, the city portion rises from about $2,074 to about $2,250.',
        'Travis County adopted $0.386210 per $100 on Sept. 15, up from $0.375845. The county dropped a one-time increase it had added for recovery from the July 2025 flood.',
        'Central Health adopted $0.132863 per $100, up from $0.118023. The increase brings in $22.1 million in new revenue for mental health care.',
        'Austin ISD lowered its rate to $0.9184 per $100, down from $0.9252.',
        'Austin Community College set $0.103643 per $100, slightly above last year.',
      ] },
      p('Home values also moved. The Travis Central Appraisal District reports the county’s median homestead value fell about 5%, from $519,677 to $493,449. So even where a rate went up, a lower value can soften the change.'),
      h('What to do with this'),
      { t: 'list', items: [
        'Find your own bill. The split above is for a typical homeowner, not for your house.',
        'Check the value on your appraisal notice, and see whether you are getting every exemption you qualify for. The Travis Central Appraisal District and the Travis County tax office can tell you what applies.',
        'Mark your calendar. Community Impact reports that bills are due Feb. 1, 2027.',
      ] },
    ],
    take: '',
    takeLabel: '',
    sources: [
      { name: 'Community Impact: Where Austin property taxes go this year', url: 'https://communityimpact.com/central-austin/government/where-austin-property-taxes-go-this-year/' },
      { name: 'Travis County: Taxpayer statement and tax rate information', url: 'https://www.traviscountytx.gov/planning-budget/tc-taxpayer-statement' },
    ],
    note: 'Last checked Nov. 13, 2026. Figures are as reported by Community Impact and Travis County, and are for typical homeowners. Check your own tax bill and appraisal notice. This is general information, not tax advice.',
  },
  {
    slug: 'public-wifi-safety',
    author: 'caleb',
    draft: true,
    lane: 'Guide',
    topic: 'Cybersecurity',
    title: 'Before You Connect to Public Wi-Fi: What Is Actually Risky Now',
    dek: 'Coffee shops, airports, hotels and libraries. Public Wi-Fi is safer than it used to be, but a few habits still matter.',
    date: '2026-11-13',
    body: [
      p('You are at a coffee shop, an airport, a hotel or a library, and the Wi-Fi is free. Is it safe? The honest answer has changed over the years, so here is what the Federal Trade Commission says now.'),
      h('The good news'),
      p('Most websites now encrypt the information you send, so using a public hotspot is usually safe. Before you enter any information, check for the lock symbol or “https” in the address bar. That applies on your phone’s browser too. It is harder to check inside mobile apps, but the FTC notes that most apps use encryption.'),
      h('The catch'),
      p('Encryption does not make a site trustworthy. Scammers build fake websites that are encrypted so they look safe. The data you send is protected on the way, but the scammers running the site can still read it. So the lock symbol tells you the connection is private. It does not tell you the site is real.'),
      h('Habits that still matter'),
      { t: 'list', items: [
        'Check the site address before you log in or pay. Make sure it is the real one, and not a look-alike.',
        'Use strong passwords, and turn on two-factor authentication anywhere it is offered.',
        'Keep your phone, computer, browser and security software up to date. Turn on automatic updates.',
        'Be careful with links from texts and emails, even on a safe network. See our guide on fake toll texts.',
        'If a site or an app seems off, do not enter anything. Go to the company’s real website yourself.',
      ] },
      h('If you got scammed'),
      p('Report it to the FTC at reportfraud.ftc.gov, and tell your bank or card company if money or card numbers are involved.'),
    ],
    take: '',
    takeLabel: '',
    sources: [
      { name: 'Federal Trade Commission: public Wi-Fi guidance', url: 'https://consumer.ftc.gov/node/298664' },
      { name: 'Federal Trade Commission: report fraud', url: 'https://reportfraud.ftc.gov/' },
    ],
    note: 'Last checked Nov. 13, 2026. General information only.',
  },
];

export const byAuthor = (a: Post['author'], withDrafts = false) =>
  posts.filter((x) => x.author === a && (withDrafts || !x.draft));
export const finished = (a: Post['author']) => byAuthor(a).filter((x) => !x.teaser);
export const findPost = (a: string, slug: string) => posts.find((x) => x.author === a && x.slug === slug);
export const fmtDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const ICONS: Record<string, string> = { 'Tori’s Take': '☕', 'Tori Reacts': '👀', 'Quick Tea': '🔥', 'Guide': '🧭' };
export const laneBadge = (lane: string) => (ICONS[lane] ? `${ICONS[lane]} ${lane}` : lane);
export const readMin = (post: Post) => {
  const words = post.body.map((b) => (b.t === 'p' || b.t === 'h' || b.t === 'quote' ? b.text : b.t === 'list' ? b.items.join(' ') : '')).join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

// Short outlet label for a source name, e.g. "KUT 90.5: Texas data centers (Aug 5, 2026)" -> "KUT 90.5".
export const outlet = (name: string) => name.replace(/\s*\([^)]*\)/g, '').split(/[:,]/)[0].trim();
// The sourced article a Caleb Reports piece reacts to (first source, with a link when it has one).
export const reactingTo = (post: Post) => {
  const s = post.sources.find((x) => x.url) ?? post.sources[0];
  return s ? { label: s.short ?? outlet(s.name), url: s.url } : undefined;
};
