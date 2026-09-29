import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

loadLocalEnv();

const args = parseArgs(process.argv.slice(2));
const storyArg = args.story || "all";
const voiceId = args.voice || process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
const modelId = args.model || process.env.ELEVENLABS_MODEL_ID || "eleven_v4";
const outputFormat = args.output || process.env.ELEVENLABS_OUTPUT_FORMAT || "mp3_44100_128";
const apiKey = process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
  throw new Error("Missing ELEVENLABS_API_KEY. Add it to elevenlabs.local.env, .env, or GitHub Actions secrets.");
}

if (!apiKey.startsWith("sk_")) {
  throw new Error(
    "ELEVENLABS_API_KEY must be the secret API key value that starts with sk_. " +
      "It looks like this file contains an API key ID instead. In ElevenLabs, create or rotate an API key and copy the sk_ value when it is shown."
  );
}

const stories = JSON.parse(await readFile(new URL("../data/stories.json", import.meta.url), "utf8"));
const selectedStories =
  storyArg === "all" ? stories : stories.filter((story) => story.id === storyArg);

if (selectedStories.length === 0) {
  throw new Error(`No story found for "${storyArg}".`);
}

for (const story of selectedStories) {
  const audioPath = new URL(`../${story.audioSrc}`, import.meta.url);
  await mkdir(dirname(fileURLToPath(audioPath)), { recursive: true });

  console.log(`Generating ${story.title}...`);
  const audio = await createSpeech({
    apiKey,
    voiceId,
    modelId,
    outputFormat,
    text: getStoryText(story)
  });

  await writeFile(audioPath, Buffer.from(audio));
  console.log(`Saved ${story.audioSrc}`);
}

async function createSpeech({ apiKey, voiceId, modelId, outputFormat, text }) {
  const endpoint = new URL(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`);
  endpoint.searchParams.set("output_format", outputFormat);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "xi-api-key": apiKey
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.45,
        similarity_boost: 0.75,
        style: 0.35,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ElevenLabs request failed (${response.status}): ${body}`);
  }

  return response.arrayBuffer();
}

function parseArgs(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) continue;
    const key = value.slice(2);
    parsed[key] = values[index + 1];
    index += 1;
  }
  return parsed;
}

function getStoryText(story) {
  if (Array.isArray(story.scriptParagraphs)) {
    return story.scriptParagraphs.join("\n\n");
  }
  return story.script;
}

function loadLocalEnv() {
  for (const envFile of [".env", "elevenlabs.local.env"]) {
    const envPath = `${root}${envFile}`;
    if (!existsSync(envPath)) continue;
    loadEnvFile(envPath);
  }
}

function loadEnvFile(envPath) {
  const contents = readFileSync(envPath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    const value = rawValue.replace(/^["']|["']$/g, "");
    process.env[key] = process.env[key] || value;
  }
}
