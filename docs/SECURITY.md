# Secret Handling

The ElevenLabs API key must never be placed in client-side code, HTML, browser
JavaScript, or public data files.

## Safe Paths

Local generation:

- Store the key in `.env`.
- `.env` is listed in `.gitignore`.
- `scripts/generate-audio.mjs` reads the key from the local environment.

GitHub generation:

- Store the key as a GitHub Actions repository secret named
  `ELEVENLABS_API_KEY`.
- The workflow injects it only into the audio generation step.
- The static web page receives only finished MP3 files.

## Why This Design

GitHub Pages is static hosting. Anything shipped to the browser can be read by
visitors. A browser-side ElevenLabs call would expose the API key. This project
therefore treats audio generation as a private build-time task, not as a public
runtime feature.

