const select = document.querySelector("#story-select");
const playButton = document.querySelector("#play-button");
const audio = document.querySelector("#audio-player");
const statusLine = document.querySelector("#status");
const storyTitle = document.querySelector("#story-title");
const storyFocus = document.querySelector("#story-focus");
const script = document.querySelector("#script");

let stories = [];
let selectedStory = null;

async function loadStories() {
  const response = await fetch("data/stories.json");
  if (!response.ok) {
    throw new Error("Story data could not be loaded.");
  }
  stories = await response.json();
  renderOptions();
  selectStory(stories[0].id);
}

function renderOptions() {
  select.innerHTML = stories
    .map((story) => `<option value="${story.id}">${story.title}</option>`)
    .join("");
}

function selectStory(storyId) {
  selectedStory = stories.find((story) => story.id === storyId);
  if (!selectedStory) return;

  select.value = selectedStory.id;
  audio.pause();
  audio.currentTime = 0;
  audio.src = selectedStory.audioSrc;
  setPlaybackState("play");
  playButton.disabled = false;
  statusLine.textContent = "";

  storyTitle.textContent = selectedStory.title;
  storyFocus.textContent = selectedStory.focus;
  script.innerHTML = getScriptParagraphs(selectedStory)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function getScriptParagraphs(story) {
  if (Array.isArray(story.scriptParagraphs)) {
    return story.scriptParagraphs;
  }
  return story.script.split("\n\n");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return replacements[character];
  });
}

async function togglePlayback() {
  if (!selectedStory) return;

  if (!audio.paused) {
    audio.pause();
    setPlaybackState("play");
    statusLine.textContent = "Paused.";
    return;
  }

  try {
    await audio.play();
    setPlaybackState("pause");
    statusLine.textContent = `Playing ${selectedStory.title}.`;
  } catch (error) {
    setPlaybackState("play");
    statusLine.textContent =
      "This recording has not been generated yet. Add the MP3 to the audio folder.";
  }
}

function setPlaybackState(state) {
  playButton.dataset.state = state;
  playButton.setAttribute("aria-label", state === "pause" ? "Pause selected story" : "Play selected story");
}

select.addEventListener("change", (event) => {
  selectStory(event.target.value);
});

playButton.addEventListener("click", togglePlayback);

audio.addEventListener("ended", () => {
  setPlaybackState("play");
  statusLine.textContent = "Finished.";
});

audio.addEventListener("error", () => {
  setPlaybackState("play");
  statusLine.textContent =
    "This recording has not been generated yet. Add the MP3 to the audio folder.";
});

loadStories().catch((error) => {
  playButton.disabled = true;
  statusLine.textContent = error.message;
});
