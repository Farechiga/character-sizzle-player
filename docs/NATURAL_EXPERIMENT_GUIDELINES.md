# Natural Experiment Guidelines

## Core Promise

Make a comparison feel like a mystery a kid would want to solve.

The pattern is:

1. Two things look meaningfully alike.
2. One important outcome turns out very different.
3. Easy explanations are tested and narrowed.
4. Better clues reveal the old doors, rules, and habits underneath.
5. The ending leaves the listener with a reusable way to ask why.

## Opening Shape

Begin with the comparison, not the explanation.

Name the two cases quickly:

> Japan and South Korea sit close together on the map. Both are wealthy,
> high-tech democracies with deep ties to the United States.

Then give two or three concrete comparability facts. Use sourced facts whenever
possible:

- geography or shared region
- similar economic development
- similar technology or education indicators
- similar postwar alliance structure
- shared cultural inheritance, when true

Do not overclaim similarity. If one country is much larger, older, poorer,
younger, or structured differently, say that plainly.

## The Reveal

The reveal is the first big turn.

Use one clear number pair when possible:

> Pew Research Center found that 32% of South Korean adults identify as
> Christian. In Japan, the number was 2%.

This should feel like the moment the listener says, wait, why?

## False Suspects

List two or three tempting explanations, then show why they are incomplete.

Good false suspects:

- geography alone
- wealth alone
- climate alone
- national personality
- one famous leader
- U.S. influence alone
- "culture" as a vague catch-all

The goal is not to mock the guesses. The goal is to teach better causal
thinking.

## Grounded Clues

Move from guesses to evidence. When the evidence needs an unfamiliar term,
translate it immediately for a bright third grader.

Good:

> The Tokugawa shogunate was the warrior government that ran Japan for more
> than two hundred years. A shogun was like the top military boss.

Less good:

> Under Tokugawa rule, Christianity became institutionally marginal.

Look for:

- timing
- institutions
- laws
- schools
- trade routes
- state power
- social status
- repression
- local leadership
- feedback loops
- moments when one choice made the next choice easier

Keep adult concepts in the background until the pattern is clear. You can name
them at the end only if the listener has already felt the pattern:

- path dependence
- lock-in
- incentives
- institutions
- social structure
- contingency

## Script Shape

The default spoken target is 500-750 words.

Use this structure:

1. Mystery doorway: 3-5 sentences.
2. Comparability facts: 2-4 sourced facts.
3. Reveal: 1 sharp number pair or contrast.
4. False suspects: 2-3 tempting explanations that do not fully work.
5. Better clues: 3-5 grounded historical or structural factors.
6. Pattern name: what doors opened, what doors locked, and what habits stuck?
7. Final question: something reusable, not just this case.

## Kid Voice and Pauses

Natural experiments can include two recurring kid interlocutors. They are not
there to be cute filler. They make the thinking audible.

Audrey is crisp, incredulous, and systems-minded. She is a little prim, a little
combative, and very interested in whether the explanation actually works.

- "Wait. What does that mean?"
- "So money and phones do not solve the mystery."
- "The Toku-what-now?"
- "That is not a tiny difference."

Paxten is softer, more open, and more contemplative. She adds space and wonder:

- "Could it really be like that?"
- "How uncanny."
- "You would not expect that."
- "Let me consider that a bit."

Use the kid voice to:

- slow down dense passages
- restate the hard point in plain words
- ask the obvious question
- add a little silliness without breaking the investigation

When a big question lands, give it air.

Good:

> Wait. Thirty-two and two?
>
> Yes. Hmm. Interesting.

Do not rush from a surprising number into an explanation. Let the listener feel
the puzzle first.

## Tone

Use a streamlined Radiolab-like feel:

- curious
- quick
- vivid
- conversational
- concrete
- lightly suspenseful

Avoid jargon-babble.

Good:

> The answer is not one big switch. It is a bundle of smaller switches, flipped
> at different times.

Less good:

> Divergent institutional matrices mediated confessional uptake across
> post-imperial civic formations.

Also avoid vague college essay endings.

Good:

> When two places look alike today, what old doors were opened in one place and
> locked in the other?

Less good:

> What historical machine was each country sitting inside?

## Source Rules

Every natural experiment should include repository-level sources in
`data/natural-experiments.json`.

Prefer:

- `.gov` for official diplomatic, historical, census, or agency facts
- `.edu` for university scholarship
- `.org` for reputable research centers, museums, libraries, and educational
  organizations
- peer-reviewed books or articles when the explanation rests on scholarship

In the script, attribute the key numbers in plain language:

> According to the World Bank...

> Pew Research Center's 2023 survey found...

Sources should support the comparison and the explanation. They should not sit
there decoratively.

## Data Fields

Each item in `data/natural-experiments.json` should include:

- `id`: short machine-readable name
- `title`: question-style title
- `author`: usually `Natural experiment`
- `lengthLabel`: usually `investigation`
- `focus`: one-line teaser
- `framing`: the comparison in one sentence
- `comparisonPoints`: two or more sourced comparability points
- `reveal`: the surprising difference
- `audioSrc`: MP3 path
- `scriptParagraphs`: spoken script
- `dialogueSegments`: optional speaker turns for ElevenLabs dialogue mode
- `sources`: repository-level source list with notes

Each dialogue segment should include:

- `role`: `narrator`, `audrey`, or `paxten`
- `speaker`: display name in the web player
- `text`: clean script text shown on the page
- `audioText`: optional ElevenLabs performance text with tags such as
  `[curious]`

## Creation Pathway

1. Add the question and source-backed script to `data/natural-experiments.json`.
2. Run validation.
3. Generate audio with:

```bash
npm run audio:korea-japan-christianity
```

For a new item, add a matching package script or use:

```bash
node scripts/generate-audio.mjs --collection natural-experiments --story item-id
```

For dialogue scripts, set these in `elevenlabs.local.env`:

```bash
ELEVENLABS_NARRATOR_VOICE_ID=your_narrator_voice
ELEVENLABS_AUDREY_VOICE_ID=jkUnCsbErmJrcbWk1Hmh
ELEVENLABS_PAXTEN_VOICE_ID=XXphLKNRxvJ1Qa95KBhX
```

4. Check the MP3 path listed in `audioSrc`.
5. Commit and push the data, docs, UI changes, and audio file.
