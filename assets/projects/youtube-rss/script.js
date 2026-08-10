const lookupForm = document.getElementById("lookup");
const sourceInput = document.getElementById("source-input");
const feedUrlInput = document.getElementById("feed-url");
const errorEl = document.getElementById("error");
const filtersEl = document.getElementById("filters");
const resultSection = document.getElementById("result");
const noticeEl = document.getElementById("notice");
const copyButton = document.getElementById("copy-button");
const submitButton = document.getElementById("submit-button");
const resultLink = document.getElementById("result-link");
const resultTitle = document.getElementById("result-title");
const imageWrap = document.getElementById("result-image-wrap");
const image = document.getElementById("result-image");

const RESOLVER_URL = "https://youtube-proxy.samq64.workers.dev/";
const FEED_URL = "https://www.youtube.com/feeds/videos.xml";

// Matches --motion, so the old result is gone before the new one fades in.
const SWAP_DELAY = 250;

const TYPES = [
  { label: "Public", value: "public", checked: true },
  { label: "Members only", value: "members" },
  { label: "Popular", value: "popular" },
];

const FORMATS = [
  { label: "All", value: "all", checked: true },
  { label: "Long form", value: "longform" },
  { label: "Shorts", value: "shorts" },
  { label: "Live streams", value: "live" },
];

// Uploads playlist IDs are the channel ID with UC swapped for one of these. A null
// prefix means the plain channel feed already covers it.
const PREFIX = {
  public: { all: null, longform: "UULF", shorts: "UUSH", live: "UULV" },
  popular: { all: "PU", longform: "UULP", shorts: "UUPS", live: "UUPV" },
  members: { all: "UUMO", longform: "UUMF", shorts: "UUMS", live: "UUMV" },
};

let state = { result: null, error: null };

function renderFieldset(legendText, name, options) {
  const legend = document.createElement("legend");
  legend.textContent = legendText;

  const fieldset = document.createElement("fieldset");
  fieldset.append(legend);

  for (const { label, value, checked } of options) {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = name;
    radio.value = value;
    radio.checked = Boolean(checked);

    const wrapper = document.createElement("label");
    wrapper.append(radio, label);
    fieldset.append(wrapper);
  }

  return fieldset;
}

function selected(name) {
  return document.querySelector(`input[name="${name}"]:checked`).value;
}

function feedUrl() {
  const { result } = state;
  if (result.type === "playlist") {
    return `${FEED_URL}?playlist_id=${result.id}`;
  }
  const prefix = PREFIX[selected("type")][selected("format")];
  return prefix
    ? `${FEED_URL}?playlist_id=${prefix + result.id.slice(2)}`
    : `${FEED_URL}?channel_id=${result.id}`;
}

function replaceUrl(q) {
  const params = new URLSearchParams({ q });
  if (state.result?.type !== "playlist") {
    params.set("type", selected("type"));
    params.set("format", selected("format"));
  }
  history.replaceState(null, "", "?" + params.toString());
}

function setError(msg) {
  state = { result: null, error: msg };
  history.replaceState(null, "", location.pathname);
  render();
}

function render() {
  const { result, error } = state;
  errorEl.classList.toggle("visible", !!error);
  errorEl.textContent = error ?? "";
  resultSection.classList.toggle("visible", !!result);
  const showFilters = !!result && result.type !== "playlist";
  filtersEl.style.display = showFilters ? "flex" : "none";
  noticeEl.classList.toggle("visible", showFilters && selected("type") === "popular");
  if (!result) return;

  image.src = "";
  if (result.type === "playlist") {
    imageWrap.className = "thumbnail";
    image.alt = "Playlist thumbnail";
    resultLink.href = `https://www.youtube.com/playlist?list=${result.id}`;
  } else {
    imageWrap.className = "avatar";
    image.alt = "Channel avatar";
    resultLink.href = `https://www.youtube.com/channel/${result.id}`;
  }
  image.src = result.thumbnail;
  resultTitle.textContent = result.name;
  feedUrlInput.value = feedUrl();
  feedUrlInput.scrollLeft = feedUrlInput.scrollWidth;
}

async function resolveChannel() {
  submitButton.disabled = true;
  submitButton.textContent = "Loading";
  const raw = sourceInput.value.trim();
  try {
    const res = await fetch(`${RESOLVER_URL}?q=${encodeURIComponent(raw)}`);
    const result = await res.json();
    if (result.error) {
      setError(result.error);
      return;
    }
    if (state.result?.type !== result.type) {
      resultSection.classList.remove("visible");
      await new Promise((resolve) => setTimeout(resolve, SWAP_DELAY));
    }
    state = { result, error: null };
    replaceUrl(result.handle ?? result.id);
    render();
  } catch (e) {
    setError(`Fetch error: ${e}`);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Get Feed";
  }
}

filtersEl.append(
  renderFieldset("Type", "type", TYPES),
  renderFieldset("Format", "format", FORMATS),
);

lookupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  resolveChannel();
});

filtersEl.addEventListener("change", () => {
  render();
  if (state.result) replaceUrl(state.result.handle ?? state.result.id);
});

copyButton.addEventListener("click", async () => {
  await navigator.clipboard.writeText(feedUrlInput.value);
  copyButton.textContent = "Copied!";
  setTimeout(() => (copyButton.textContent = "Copy"), 1000);
});

const searchParams = new URLSearchParams(location.search);
for (const name of ["type", "format"]) {
  const radio = document.querySelector(`input[name="${name}"][value="${searchParams.get(name)}"]`);
  if (radio) radio.checked = true;
}

const initial = searchParams.get("q");
if (initial) {
  const isId = initial.startsWith("UC") || initial.startsWith("PL");
  sourceInput.value = isId ? initial : "@" + initial;
  resolveChannel();
}
