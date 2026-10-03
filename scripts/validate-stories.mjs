import { readFile } from "node:fs/promises";

const collections = [
  {
    name: "stories",
    url: new URL("../data/stories.json", import.meta.url),
    required: ["id", "title", "author", "focus", "audioSrc"]
  },
  {
    name: "natural experiments",
    singularName: "natural experiment",
    url: new URL("../data/natural-experiments.json", import.meta.url),
    required: ["id", "title", "author", "focus", "audioSrc", "framing"]
  }
];

const globalIds = new Set();
const counts = [];

for (const collection of collections) {
  const items = JSON.parse(await readFile(collection.url, "utf8"));
  const localIds = new Set();

  for (const item of items) {
    for (const field of collection.required) {
      if (!item[field] || typeof item[field] !== "string") {
        throw new Error(`${collection.name} item ${item.id || "(missing id)"} is missing ${field}.`);
      }
    }

    if (!Array.isArray(item.scriptParagraphs) || item.scriptParagraphs.length === 0) {
      throw new Error(`${collection.name} item ${item.id} must include scriptParagraphs.`);
    }

    for (const paragraph of item.scriptParagraphs) {
      if (!paragraph || typeof paragraph !== "string") {
        throw new Error(`${collection.name} item ${item.id} has an invalid script paragraph.`);
      }
    }

    if (localIds.has(item.id) || globalIds.has(item.id)) {
      throw new Error(`Duplicate item id: ${item.id}`);
    }

    if (!item.audioSrc.startsWith("audio/") || !item.audioSrc.endsWith(".mp3")) {
      throw new Error(`${collection.name} item ${item.id} must point to an audio/*.mp3 file.`);
    }

    if (collection.name === "natural experiments") {
      validateNaturalExperiment(item);
    }

    localIds.add(item.id);
    globalIds.add(item.id);
  }

  counts.push(`${items.length} ${items.length === 1 && collection.singularName ? collection.singularName : collection.name}`);
}

console.log(`Validated ${counts.join(" and ")}.`);

function validateNaturalExperiment(item) {
  if (!Array.isArray(item.comparisonPoints) || item.comparisonPoints.length < 2) {
    throw new Error(`Natural experiment ${item.id} must include at least two comparisonPoints.`);
  }

  for (const point of item.comparisonPoints) {
    if (!point.label || !point.detail) {
      throw new Error(`Natural experiment ${item.id} has an invalid comparison point.`);
    }
  }

  if (!item.reveal || !item.reveal.label || !item.reveal.detail) {
    throw new Error(`Natural experiment ${item.id} must include a reveal.`);
  }

  if (!Array.isArray(item.sources) || item.sources.length === 0) {
    throw new Error(`Natural experiment ${item.id} must include sources.`);
  }

  for (const source of item.sources) {
    if (!source.label || !source.url || !source.note) {
      throw new Error(`Natural experiment ${item.id} has an invalid source.`);
    }
  }
}
