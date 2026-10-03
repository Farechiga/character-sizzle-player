import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

loadLocalEnv();

const args = parseArgs(process.argv.slice(2));
const storyArg = args.story || "all";
const collectionArg = args.collection || "stories";
const voiceId = args.voice || process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
const modelId = args.model || process.env.ELEVENLABS_MODEL_ID || "eleven_v4";
const dialogueModelId = args["dialogue-model"] || process.env.ELEVENLABS_DIALOGUE_MODEL_ID || modelId;
const outputFormat = args.output || process.env.ELEVENLABS_OUTPUT_FORMAT || "mp3_44100_128";
const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceMap = getVoiceMap({ args, narratorVoiceId: voiceId });

if (!apiKey) {
  throw new Error("Missing ELEVENLABS_API_KEY. Add it to elevenlabs.local.env, .env, or GitHub Actions secrets.");
}

if (!apiKey.startsWith("sk_")) {
  throw new Error(
    "ELEVENLABS_API_KEY must be the secret API key value that starts with sk_. " +
      "It looks like this file contains an API key ID instead. In ElevenLabs, create or rotate an API key and copy the sk_ value when it is shown."
  );
}

const collections = await loadCollections(collectionArg);
const allItems = collections.flatMap((collection) => collection.items);
const selectedStories =
  storyArg === "all" ? allItems : allItems.filter((story) => story.id === storyArg);

if (selectedStories.length === 0) {
  throw new Error(`No item found for "${storyArg}" in collection "${collectionArg}".`);
}

for (const story of selectedStories) {
  const audioPath = new URL(`../${story.audioSrc}`, import.meta.url);
  await mkdir(dirname(fileURLToPath(audioPath)), { recursive: true });

  console.log(`Generating ${story.title}...`);
  const audio = Array.isArray(story.dialogueSegments)
    ? await createDialogue({
        apiKey,
        modelId: dialogueModelId,
        outputFormat,
        inputs: getDialogueInputs(story, voiceMap)
      })
    : await createSpeech({
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

async function createDialogue({ apiKey, modelId, outputFormat, inputs }) {
  const chunks = chunkDialogueInputs(inputs);
  const audioBuffers = [];

  for (const [index, chunk] of chunks.entries()) {
    console.log(`  Dialogue chunk ${index + 1}/${chunks.length}...`);
    const endpoint = new URL("https://api.elevenlabs.io/v1/text-to-dialogue");
    endpoint.searchParams.set("output_format", outputFormat);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey
      },
      body: JSON.stringify({
        inputs: chunk,
        model_id: modelId
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`ElevenLabs dialogue request failed (${response.status}): ${body}`);
    }

    audioBuffers.push(Buffer.from(await response.arrayBuffer()));
  }

  if (audioBuffers.length === 1) {
    return audioBuffers[0];
  }

  return combineAudioBuffers(audioBuffers, outputFormat);
}

function chunkDialogueInputs(inputs) {
  const maxCharacters = Number(process.env.ELEVENLABS_DIALOGUE_CHUNK_CHARS || 1800);
  const chunks = [];
  let current = [];
  let currentLength = 0;

  for (const input of inputs) {
    const nextLength = input.text.length;
    if (current.length > 0 && currentLength + nextLength > maxCharacters) {
      chunks.push(current);
      current = [];
      currentLength = 0;
    }

    current.push(input);
    currentLength += nextLength;
  }

  if (current.length > 0) {
    chunks.push(current);
  }

  return chunks;
}

async function combineAudioBuffers(audioBuffers, outputFormat) {
  if (!outputFormat.startsWith("mp3_")) {
    throw new Error("Dialogue chunk stitching currently expects MP3 output. Set ELEVENLABS_OUTPUT_FORMAT to an mp3_* value.");
  }

  const tempDir = await mkdtemp(join(tmpdir(), "story-sizzle-audio-"));

  try {
    const inputPaths = [];
    for (const [index, audio] of audioBuffers.entries()) {
      const inputPath = join(tempDir, `chunk-${index}.mp3`);
      await writeFile(inputPath, audio);
      inputPaths.push(inputPath);
    }

    const listPath = join(tempDir, "inputs.txt");
    const outputPath = join(tempDir, "combined.mp3");
    await writeFile(
      listPath,
      inputPaths.map((inputPath) => `file '${inputPath.replaceAll("'", "'\\''")}'`).join("\n")
    );

    const ffmpeg = spawnSync(process.env.FFMPEG_PATH || "ffmpeg", [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listPath,
      "-c",
      "copy",
      outputPath
    ]);

    if (ffmpeg.status !== 0) {
      throw new Error(`ffmpeg failed while combining dialogue chunks: ${ffmpeg.stderr.toString()}`);
    }

    return readFile(outputPath);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
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

function getDialogueInputs(story, voices) {
  return story.dialogueSegments.map((segment) => {
    const voiceId = voices[segment.role] || voices.narrator;
    if (!voiceId) {
      throw new Error(`No ElevenLabs voice configured for dialogue role "${segment.role}".`);
    }

    return {
      text: segment.audioText || segment.text,
      voice_id: voiceId
    };
  });
}

function getVoiceMap({ args, narratorVoiceId }) {
  const kidVoiceId =
    args["kid-voice"] ||
    process.env.ELEVENLABS_KID_VOICE_ID ||
    process.env.ELEVENLABS_CHILD_VOICE_ID ||
    "jkUnCsbErmJrcbWk1Hmh";
  const audreyVoiceId =
    args["audrey-voice"] ||
    process.env.ELEVENLABS_AUDREY_VOICE_ID ||
    kidVoiceId;
  const paxtenVoiceId =
    args["paxten-voice"] ||
    process.env.ELEVENLABS_PAXTEN_VOICE_ID ||
    args["kid2-voice"] ||
    process.env.ELEVENLABS_KID2_VOICE_ID ||
    "XXphLKNRxvJ1Qa95KBhX";

  return {
    narrator: args["narrator-voice"] || process.env.ELEVENLABS_NARRATOR_VOICE_ID || narratorVoiceId,
    kid: kidVoiceId,
    kid2: paxtenVoiceId,
    audrey: audreyVoiceId,
    paxten: paxtenVoiceId
  };
}

async function loadCollections(collectionName) {
  const definitions = [
    {
      name: "stories",
      url: new URL("../data/stories.json", import.meta.url)
    },
    {
      name: "natural-experiments",
      url: new URL("../data/natural-experiments.json", import.meta.url)
    }
  ];
  const selectedDefinitions =
    collectionName === "all"
      ? definitions
      : definitions.filter((definition) => definition.name === collectionName);

  if (selectedDefinitions.length === 0) {
    throw new Error(`Unknown collection "${collectionName}". Use stories, natural-experiments, or all.`);
  }

  return Promise.all(
    selectedDefinitions.map(async (definition) => ({
      ...definition,
      items: JSON.parse(await readFile(definition.url, "utf8"))
    }))
  );
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
