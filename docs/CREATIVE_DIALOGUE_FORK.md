# Creative Dialogue Fork

This is a temporary experiment for creative-work introductions.

The goal is to keep the character-driven teaser, but let Audrey and Paxten help
the listener notice what matters. They should not become hosts who explain the
whole book. They are thinking partners who interrupt at the right moments.

## Roles

## Narrator

The narrator stays in charge of the story.

Use the narrator to:

- open the character doorway
- give the ordinary world
- name the turn
- answer Audrey and Paxten by name
- bring the focus back to the main character
- end with the character question

The narrator should sound like a favorite teacher who knows the story is alive,
not like a lecturer summarizing chapters.

## Audrey

Audrey is the logic and design voice.

She notices:

- whether a plan makes sense
- what is odd, improbable, or over-controlled
- how a character organizes the world
- where a stated motive does not quite explain the action

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

Paxten should add breath:

> Maybe she does not want to disappear. Maybe she wants to come back different.

Good Paxten lines often begin with:

- "Could it be..."
- "That sounds like..."
- "How strange..."
- "Maybe what she wants is..."

## Dialogue Mechanics

Use this pattern:

1. Narrator opens with the character and ordinary world.
2. Audrey questions the plan, motive, or logic.
3. Narrator clarifies without overexplaining.
4. Paxten reframes the feeling.
5. Narrator returns to the story and raises the stakes.
6. Audrey restates the mechanism precisely.
7. Paxten gives the emotional echo.
8. Narrator ends with the character question.

## Guardrails

- Keep the main character as the center of gravity.
- Use Audrey and Paxten for 25-35% of the spoken turns, not half the piece.
- Do not make the girls cute filler.
- Do not let them spoil the ending.
- Let them ask what a smart young listener would actually ask.
- The narrator should use their names at least twice.
- The final question should belong to the work, not to a theme essay.

## Data Shape

Use `dialogueSegments` on a normal creative-work item in `data/stories.json`.
The existing audio generator will use ElevenLabs dialogue mode automatically.

Keep `scriptParagraphs` as a plain fallback. The web player will display
`dialogueSegments` when present.
