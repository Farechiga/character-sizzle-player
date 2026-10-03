# Creative Works Dialogue Format

Use this format for creative-work introductions that weave Audrey and Paxten
into the piece.

The goal is not to follow a fixed opening order. Do not automatically start
with the creator, the title, the main character, or the plot. Start with the
live wire: whatever makes the work feel worth hearing about right now.

Audrey and Paxten are not hosts who explain the whole book. They are thinking
partners who help the listener feel the interest, pressure, unfairness,
strangeness, humor, or ache of the work. They should enter early, usually
within the first two to four spoken turns, once the hook is visible. They are
often the best way to turn "why should I care?" into a live question.

Do not introduce Audrey and Paxten at the start of each piece. Assume they are
already in the room. The opening belongs to the work itself.

## Interest First

Choose the opening doorway based on the strongest "so what?"

Possible doorways:

- a character under pressure
- a creator with a vivid reason to matter
- a title that sounds strange, unfair, funny, or provocative
- a social scandal, artistic risk, or banned subject
- a premise that feels like an experiment
- a contradiction: beautiful music around cruel behavior, comedy with real hurt,
  magic around loneliness, elegance around danger
- a question a kid would actually ask after hearing the setup

The first turns should make a listener think:

- "Wait, what?"
- "That seems unfair."
- "I did not know that."
- "Why would anyone do that?"
- "That is funnier, darker, or stranger than I expected."

## Roles

## Narrator

The narrator stays in charge of the story.

Use the narrator to:

- open the strongest doorway, whether character, creator, title, setting, or
  trouble
- give enough concrete grounding that the listener is not floating
- name the pressure or turn
- answer Audrey and Paxten by name
- bring the focus back to the living struggle inside the work
- end with a sharp question that belongs to the work

The narrator should sound like a favorite teacher who knows the story is alive,
not like a lecturer summarizing chapters.

## Audrey

Audrey is the logic and design voice.

She notices:

- whether a plan makes sense
- what is odd, improbable, or over-controlled
- how a character organizes the world
- where a stated motive does not quite explain the action
- where an adult claim is unfair, suspicious, or badly designed
- the machinery of the plot: rules, wagers, traps, disguises, bargains, tests

Audrey can be incredulous, crisp, and slightly prim:

> Running away to a museum is not chaos. It is a plan with marble floors.

Good Audrey lines often begin with:

- "Do you mean..."
- "So she is not really..."
- "That is a very particular sort of plan."
- "I want to inspect that assumption."

## Paxten

Paxten is the wonder and emotional-space voice.

She notices:

- what the plan feels like
- where a child is lonely, proud, afraid, or hopeful
- the poetic strangeness of the premise
- the quiet meaning underneath a practical choice
- where beauty and pain are sitting close together
- when the work is asking a gentler question than the plot seems to ask

Paxten should add breath:

> Maybe she does not want to disappear. Maybe she wants to come back different.

Good Paxten lines often begin with:

- "Could it be..."
- "That sounds like..."
- "How strange..."
- "Maybe what she wants is..."

## Dialogue Mechanics

Use this pattern:

1. Narrator opens with a concrete hook from the work: character, creator, title, place, or trouble.
2. Audrey or Paxten enters early to make the "so what?" audible.
3. Narrator grounds the listener in the relevant character, world, or context.
4. Audrey presses on the logic, fairness, rules, or design.
5. Paxten reframes the feeling underneath the action.
6. Narrator raises the stakes without drifting into summary.
7. Audrey names the mechanism precisely.
8. Paxten gives the emotional echo or deeper question.
9. Narrator ends with the sharpest living question.

This is a rhythm, not a required order. Skip or reorder steps when the work asks
for it. The test is interest density, not compliance.

## Guardrails

- Keep the living struggle as the center of gravity.
- Use Audrey and Paxten for 25-35% of the spoken turns, not half the piece.
- Do not spend the opening explaining who Audrey and Paxten are.
- Do not make the girls cute filler.
- Do not let them spoil the ending.
- Let them ask what a smart young listener would actually ask.
- The narrator should use their names at least twice.
- The final question should belong to the work, not to a theme essay.
- Do not force creator context. Use it only when it makes the work more
  interesting, more honest, or easier to care about.
- Do not force character-first narration. Use it when character is the best
  doorway.
- Avoid bland reverence. Famous works still need a reason to matter.
- Avoid summary drift. Every turn should either increase interest, clarify
  stakes, or deepen the question.
- Apply the dilettante filter: cut any line that sounds clever but could not
  be pictured by a smart ten-year-old.
- Apply the painful college essay filter: avoid abstract theme slogans,
  especially "not merely X, but Y" lines. Replace them with a concrete person,
  object, choice, door, room, letter, promise, danger, or consequence.

## Clean Poetry Test

Paxten can be lyrical. The narrator can be elegant. But the language should
stay timeless and visible.

Good Paxten:

> Maybe the miracle is not Christmas magic. Maybe it is hearing the knock and
> opening the door.

Too vague:

> Maybe the miracle is the restoration of relationship.

Good narrator:

> Future says almost nothing. It shows a grave and the empty space a hard life
> can leave behind.

Too essayish:

> Future externalizes the consequence of emotional isolation.

## Data Shape

Use `dialogueSegments` on a normal creative-work item in `data/stories.json`.
The existing audio generator will use ElevenLabs dialogue mode automatically.

Keep `scriptParagraphs` as a plain fallback. The web player will display
`dialogueSegments` when present.
