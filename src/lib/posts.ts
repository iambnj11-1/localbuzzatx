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
    lane: 'Tori\u2019s Take',
    teaser: true,
    cover: { src: '/blog/tori-friend-checks.jpg', alt: 'Illustration of Tori resting her chin on her hand at a desk with a pink mug, planner and sticky notes, with the headline The Friend Who Always Checks On Everyone', portrait: true },
    title: 'The Friend Who Always Checks On Everyone',
    dek: 'You know that friend who remembers everybody\u2019s birthday? The one sending the \u201cjust checking on you\u201d text? Yeah... that\u2019s usually me.',
    date: '2026-11-12',
    body: [...L(`
You know that friend who remembers everybody's birthday?
The one sending the "just checking on you" text.
The one showing up to the baby shower, graduation, retirement party, and family cookout.
Yeah... that's usually me.
And if I'm being honest, I've had to learn that not everybody loves that way.
There have been times when I've celebrated people, supported people, and made time for people only to look around and realize they weren't doing the same for me.
That used to bother me.
Now I understand that everyone gives differently.
I still believe in showing up for the people I love. I've just learned to stop keeping score.
`)],
    take: '',
    takeLabel: '',
    sources: [],
    note: 'Tori is still finishing this one. Check back soon for the full piece.',
  },
  {
    slug: 'some-apologies-change-everything',
    author: 'tori',
    lane: 'Tori\u2019s Take',
    teaser: true,
    cover: { src: '/blog/tori-apologies.jpg', alt: 'Illustration of Tori gazing thoughtfully from a café window toward the Texas Capitol and the Austin skyline, with the headline Some Apologies Change Everything, Some Never Come', portrait: true },
    title: 'Some Apologies Change Everything. Some Never Come.',
    dek: 'When I was younger, I thought every hurt could be fixed with an apology. Now I know that\u2019s not always how life works.',
    date: '2026-11-12',
    body: [...L(`
When I was younger, I thought every hurt could be fixed with an apology.
Now I know that's not always how life works.
Sometimes people know exactly what they did.
Sometimes they don't.
And sometimes they'll apologize today and repeat the same behavior tomorrow.
I've spent too much time waiting for certain conversations that never happened.
The truth is, peace doesn't always come from getting the apology.
Sometimes peace comes from accepting that the apology may never come and moving forward anyway.
That's easier said than done, but it's a lesson life keeps teaching me.
`)],
    take: '',
    takeLabel: '',
    sources: [],
    note: 'Tori is still finishing this one. Check back soon for the full piece.',
  },
  {
    slug: 'family-can-teach-you-patience',
    author: 'tori',
    lane: 'Tori\u2019s Take',
    teaser: true,
    cover: { src: '/blog/tori-family-patience.jpg', alt: 'Illustration of Tori laughing at a big family dinner table with grandparents, parents and children, with the headline Family Can Teach You Patience Like Nothing Else', portrait: true },
    title: 'Family Can Teach You Patience Like Nothing Else',
    dek: 'Growing up, our house was always full. With four brothers, four sisters, and me, quiet was never really an option.',
    date: '2026-11-12',
    body: [...L(`
Growing up, our house was always full.
With four brothers, four sisters, and me, quiet was never really an option.
Somebody was arguing.
Somebody was laughing.
Somebody was eating the last piece of something they weren't supposed to touch.
And somehow we all survived.
Having a big family taught me a lot about patience because everybody is different.
Everybody communicates differently.
Everybody handles problems differently.
Everybody shows love differently.
As I've gotten older, I've realized family will test your patience unlike anybody else. But they'll also teach you some of life's greatest lessons if you're willing to learn them.
And trust me, with nine kids under one roof, there were plenty of lessons to learn.
`)],
    take: '',
    takeLabel: '',
    sources: [],
    note: 'Tori is still finishing this one. Check back soon for the full piece.',
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
    lane: 'Caleb’s Corner',
    topic: 'Cybersecurity',
    teaser: true,
    cover: { src: '/blog/caleb-corner-older-adults.jpg', alt: 'Illustration of Caleb for helping-older-adults-stay-safe-online' },
    title: 'Helping Older Adults Stay Safe Online',
    dek: 'Older adults are common targets for online scams. Here are the warning signs and the simple steps that help.',
    date: '2026-11-12',
    body: [p('Caleb is working on a plain-English guide to the scams that target older adults, the warning signs to look for, and the simple steps that keep accounts and money safe.')],
    take: '',
    takeLabel: '',
    sources: [],
    note: 'Caleb is still finishing this one. Check back soon for the full piece.',
  },
  {
    slug: 'cybersecurity-basics-for-austin-families',
    author: 'caleb',
    lane: 'Caleb’s Corner',
    topic: 'Cybersecurity',
    teaser: true,
    cover: { src: '/blog/caleb-corner-families.jpg', alt: 'Illustration of Caleb for cybersecurity-basics-for-austin-families' },
    title: 'Cybersecurity Basics for Austin Families',
    dek: 'A plain-English guide to protecting your home network, your accounts and your devices.',
    date: '2026-11-12',
    body: [p('Caleb is putting together a plain-English guide to the first cybersecurity steps every household can take, from passwords to updates to backups.')],
    take: '',
    takeLabel: '',
    sources: [],
    note: 'Caleb is still finishing this one. Check back soon for the full piece.',
  },
  {
    slug: 'digital-inclusion-in-austin-why-access-matters',
    author: 'caleb',
    lane: 'Caleb’s Corner',
    topic: 'Cybersecurity',
    teaser: true,
    cover: { src: '/blog/caleb-corner-digital-inclusion.jpg', alt: 'Illustration of Caleb for digital-inclusion-in-austin-why-access-matters' },
    title: 'Digital Inclusion in Austin: Why Access Matters',
    dek: 'Safe, reliable internet access shapes who can work, learn and stay protected online. Here’s what that looks like in Austin.',
    date: '2026-11-12',
    body: [p('Caleb is working on a look at why safe, reliable internet access matters for everyone in Austin, and what happens when people are left offline.')],
    take: '',
    takeLabel: '',
    sources: [],
    note: 'Caleb is still finishing this one. Check back soon for the full piece.',
  },
  {
    slug: 'safer-online-habits-anyone-can-build',
    author: 'caleb',
    lane: 'Caleb’s Corner',
    topic: 'Cybersecurity',
    teaser: true,
    cover: { src: '/blog/caleb-corner-safer-habits.jpg', alt: 'Illustration of Caleb for safer-online-habits-anyone-can-build' },
    title: 'Safer Online Habits Anyone Can Build',
    dek: 'A few small routines that protect your accounts, whether you’re 18 or 80.',
    date: '2026-11-12',
    body: [p('Caleb is putting together a short list of small, repeatable habits that make anyone harder to hack, with no technical background needed.')],
    take: '',
    takeLabel: '',
    sources: [],
    note: 'Caleb is still finishing this one. Check back soon for the full piece.',
  },
  {
    slug: 'what-ai-stock-swings-mean-for-texans',
    author: 'caleb',
    lane: 'Caleb’s Corner',
    topic: 'AI & Tech',
    teaser: true,
    cover: { src: '/blog/caleb-corner-ai-stocks.jpg', alt: 'Illustration of Caleb for what-ai-stock-swings-mean-for-texans' },
    title: 'What AI Stock Swings Mean for Texans',
    dek: 'Even if you don’t trade, your retirement account may hold AI stocks. Here’s what that means here in Texas.',
    date: '2026-11-12',
    body: [p('Caleb is working on a plain-English look at what swings in AI stocks mean for everyday Texans, from retirement accounts to Austin’s tech jobs.')],
    take: '',
    takeLabel: '',
    sources: [],
    note: 'Caleb is still finishing this one. Check back soon for the full piece. General information only, not financial advice.',
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
