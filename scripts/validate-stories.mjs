import { readFile } from "node:fs/promises";

const stories = JSON.parse(await readFile(new URL("../data/stories.json", import.meta.url), "utf8"));
const required = ["id", "title", "author", "focus", "audioSrc", "script"];
const ids = new Set();

for (const story of stories) {
  for (const field of required) {
    if (!story[field] || typeof story[field] !== "string") {
      throw new Error(`Story ${story.id || "(missing id)"} is missing ${field}.`);
    }
  }

  if (ids.has(story.id)) {
    throw new Error(`Duplicate story id: ${story.id}`);
  }

  if (!story.audioSrc.startsWith("audio/") || !story.audioSrc.endsWith(".mp3")) {
    throw new Error(`Story ${story.id} must point to an audio/*.mp3 file.`);
  }

  ids.add(story.id);
}

console.log(`Validated ${stories.length} stories.`);

