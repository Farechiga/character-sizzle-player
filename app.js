const collectionConfig = {
  stories: {
    path: "data/stories.json",
    label: "Story",
    title: "Stories and questions, introduced aloud.",
    subtitle: "Choose a creative-work introduction or a natural-experiment mystery."
  },
  "natural-experiments": {
    path: "data/natural-experiments.json",
    label: "Question",
    title: "Natural experiments, investigated aloud.",
    subtitle: "Start with two things that look alike, then follow the surprising difference."
  }
};

const modeButtons = document.querySelectorAll("[data-mode]");
const pageTitle = document.querySelector("#page-title");
const pageSubtitle = document.querySelector("#page-subtitle");
const select = document.querySelector("#story-select");
const itemLabel = document.querySelector("#item-label");
const playButton = document.querySelector("#play-button");
const audio = document.querySelector("#audio-player");
const statusLine = document.querySelector("#status");
const storyTitle = document.querySelector("#story-title");
const storyFocus = document.querySelector("#story-focus");
const evidencePanel = document.querySelector("#evidence-panel");
const framingLine = document.querySelector("#framing-line");
const comparisonList = document.querySelector("#comparison-list");
const script = document.querySelector("#script");
const sourcesPanel = document.querySelector("#sources-panel");
const sourceList = document.querySelector("#source-list");

let collections = {};
let activeMode = "stories";
let selectedItem = null;

async function loadCollections() {
  const entries = await Promise.all(
    Object.entries(collectionConfig).map(async ([mode, config]) => {
      const response = await fetch(config.path);
      if (!response.ok) {
        throw new Error(`${config.label} data could not be loaded.`);
      }
      return [mode, await response.json()];
    })
  );
  collections = Object.fromEntries(entries);
  setMode(activeMode);
}

function setMode(mode) {
  if (!collections[mode]) return;

  activeMode = mode;
  const config = collectionConfig[activeMode];
  pageTitle.textContent = config.title;
  pageSubtitle.textContent = config.subtitle;
  itemLabel.textContent = config.label;
  modeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === activeMode);
  });
  renderOptions();
  selectItem(collections[activeMode][0]?.id);
}

function renderOptions() {
  select.innerHTML = collections[activeMode]
    .map((item) => `<option value="${item.id}">${item.title}</option>`)
    .join("");
}

function selectItem(itemId) {
  selectedItem = collections[activeMode].find((item) => item.id === itemId);
  if (!selectedItem) return;

  select.value = selectedItem.id;
  audio.pause();
  audio.currentTime = 0;
  audio.src = selectedItem.audioSrc;
  setPlaybackState("play");
  playButton.disabled = false;
  statusLine.textContent = "";

  storyTitle.textContent = selectedItem.title;
  storyFocus.textContent = selectedItem.focus;
  renderEvidence(selectedItem);
  script.innerHTML = getScriptParagraphs(selectedItem)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
  renderSources(selectedItem);
}

function renderEvidence(item) {
  const comparisonPoints = Array.isArray(item.comparisonPoints) ? item.comparisonPoints : [];
  if (!item.framing && comparisonPoints.length === 0 && !item.reveal) {
    evidencePanel.hidden = true;
    framingLine.textContent = "";
    comparisonList.innerHTML = "";
    return;
  }

  framingLine.textContent = item.framing || "";
  const cards = comparisonPoints.map((point) => {
    return `<article class="comparison-card"><strong>${escapeHtml(point.label)}</strong><span>${escapeHtml(point.detail)}</span></article>`;
  });
  if (item.reveal) {
    cards.push(
      `<article class="comparison-card reveal-card"><strong>${escapeHtml(item.reveal.label)}</strong><span>${escapeHtml(item.reveal.detail)}</span></article>`
    );
  }
  comparisonList.innerHTML = cards.join("");
  evidencePanel.hidden = false;
}

function renderSources(item) {
  const sources = Array.isArray(item.sources) ? item.sources : [];
  if (sources.length === 0) {
    sourcesPanel.hidden = true;
    sourceList.innerHTML = "";
    return;
  }

  sourceList.innerHTML = sources
    .map((source) => {
      const note = source.note ? `<span>${escapeHtml(source.note)}</span>` : "";
      return `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a>${note}</li>`;
    })
    .join("");
  sourcesPanel.hidden = false;
}

function getScriptParagraphs(item) {
  if (Array.isArray(item.scriptParagraphs)) {
    return item.scriptParagraphs;
  }
  return item.script.split("\n\n");
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
  if (!selectedItem) return;

  if (!audio.paused) {
    audio.pause();
    setPlaybackState("play");
    statusLine.textContent = "Paused.";
    return;
  }

  try {
    await audio.play();
    setPlaybackState("pause");
    statusLine.textContent = `Playing ${selectedItem.title}.`;
  } catch (error) {
    setPlaybackState("play");
    statusLine.textContent =
      "This recording has not been generated yet. Add the MP3 to the audio folder.";
  }
}

function setPlaybackState(state) {
  playButton.dataset.state = state;
  playButton.setAttribute("aria-label", state === "pause" ? "Pause selected item" : "Play selected item");
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setMode(button.dataset.mode);
  });
});

select.addEventListener("change", (event) => {
  selectItem(event.target.value);
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

loadCollections().catch((error) => {
  playButton.disabled = true;
  statusLine.textContent = error.message;
});
