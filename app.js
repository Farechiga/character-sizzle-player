const select = document.querySelector("#story-select");
const playButton = document.querySelector("#play-button");
const audio = document.querySelector("#audio-player");
const statusLine = document.querySelector("#status");
const storyKicker = document.querySelector("#story-kicker");
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
  playButton.textContent = "Play";
  playButton.disabled = false;
  statusLine.textContent = "";

  storyKicker.textContent = `${selectedStory.author} / ${selectedStory.lengthLabel}`;
  storyTitle.textContent = selectedStory.title;
  storyFocus.textContent = selectedStory.focus;
  script.innerHTML = selectedStory.script
    .split("\n\n")
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
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
    playButton.textContent = "Play";
    statusLine.textContent = "Paused.";
    return;
  }

  try {
    await audio.play();
    playButton.textContent = "Pause";
    statusLine.textContent = `Playing ${selectedStory.title}.`;
  } catch (error) {
    playButton.textContent = "Play";
    statusLine.textContent =
      "This recording has not been generated yet. Add the MP3 to the audio folder.";
  }
}

select.addEventListener("change", (event) => {
  selectStory(event.target.value);
});

playButton.addEventListener("click", togglePlayback);

audio.addEventListener("ended", () => {
  playButton.textContent = "Play";
  statusLine.textContent = "Finished.";
});

audio.addEventListener("error", () => {
  playButton.textContent = "Play";
  statusLine.textContent =
    "This recording has not been generated yet. Add the MP3 to the audio folder.";
});

loadStories().catch((error) => {
  playButton.disabled = true;
  statusLine.textContent = error.message;
});

