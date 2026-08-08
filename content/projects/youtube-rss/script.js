const inputEl = document.getElementById("inputEl");
const outputEl = document.getElementById("outputEl");
const errorEl = document.getElementById("error");
const filtersEl = document.getElementById("filters");
const outputSection = document.getElementById("output");
const noticeEl = document.getElementById("notice");
const copyBtn = document.getElementById("copyBtn");
const submitBtn = document.getElementById("submitBtn");
const link = document.getElementById("link");
const linkText = document.getElementById("linkText");
const imageWrap = document.getElementById("resultImgWrap");
const image = document.getElementById("resultImg");

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

function renderFieldset(legend, name, options) {
  return `<fieldset><legend>${legend}</legend>${options
    .map(
      ({ label, value, checked }) =>
        `<label><input type="radio" name="${name}" value="${value}"${checked ? " checked" : ""} />${label}</label>`,
    )
    .join("")}</fieldset>`;
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
  outputSection.classList.toggle("visible", !!result);
  const showFilters = !!result && result.type !== "playlist";
  filtersEl.style.display = showFilters ? "flex" : "none";
  noticeEl.classList.toggle("visible", showFilters && selected("type") === "popular");
  if (!result) return;

  image.src = "";
  if (result.type === "playlist") {
    imageWrap.className = "thumbnail";
    image.alt = "Playlist thumbnail";
    link.href = `https://www.youtube.com/playlist?list=${result.id}`;
  } else {
    imageWrap.className = "avatar";
    image.alt = "Channel avatar";
    link.href = `https://www.youtube.com/channel/${result.id}`;
  }
  image.src = result.thumbnail;
  linkText.textContent = result.name;
  outputEl.value = feedUrl();
  outputEl.scrollLeft = outputEl.scrollWidth;
}

async function resolveChannel() {
  submitBtn.disabled = true;
  submitBtn.textContent = "Loading";
  const raw = inputEl.value.trim();
  try {
    const res = await fetch(`${RESOLVER_URL}?q=${encodeURIComponent(raw)}`);
    const result = await res.json();
    if (result.error) {
      setError(result.error);
      return;
    }
    if (state.result?.type !== result.type) {
      outputSection.classList.remove("visible");
      await new Promise((resolve) => setTimeout(resolve, SWAP_DELAY));
    }
    state = { result, error: null };
    replaceUrl(result.handle ?? result.id);
    render();
  } catch (e) {
    setError(`Fetch error: ${e}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Get Feed";
  }
}

filtersEl.innerHTML =
  renderFieldset("Type", "type", TYPES) + renderFieldset("Format", "format", FORMATS);

submitBtn.addEventListener("click", resolveChannel);

inputEl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") resolveChannel();
});

filtersEl.addEventListener("change", () => {
  render();
  if (state.result) replaceUrl(state.result.handle ?? state.result.id);
});

copyBtn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(outputEl.value);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy"), 1000);
});

const searchParams = new URLSearchParams(location.search);
for (const name of ["type", "format"]) {
  const radio = document.querySelector(`input[name="${name}"][value="${searchParams.get(name)}"]`);
  if (radio) radio.checked = true;
}

const initial = searchParams.get("q");
if (initial) {
  const isId = initial.startsWith("UC") || initial.startsWith("PL");
  inputEl.value = isId ? initial : "@" + initial;
  resolveChannel();
}
