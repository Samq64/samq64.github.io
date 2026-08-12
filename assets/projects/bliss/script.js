import words from "./words.js";

const SETTLE_MS = 500;

/* How far a pupil travels, in SVG units. Eyes are 26 by 19, pupil radius 8, so it stops short. */
const REACH_X = 15;
const REACH_Y = 8;

/* The direction each digit stands for, as seen by whoever is watching the eyes. */
const DIRECTIONS = {
  0: [1, -1],
  1: [0.35, -1],
  2: [-0.35, -1],
  3: [-1, -1],
  4: [1, 0],
  5: [-1, 0],
  6: [1, 1],
  7: [0, 1],
  8: [-1, 1],
};

const output = document.getElementById("output");
const digits = Array.from(document.querySelectorAll(".digit"));
const digitGroup = document.querySelector(".digits");
const pad = document.querySelector(".pad");
const backspace = document.getElementById("backspace");
const eyes = document.querySelector(".eyes");
const historyEl = document.getElementById("history");
const list = document.getElementById("list");

let clearTimer = null;
let lingerTimer;

function focusIfTyping(input) {
  if (digits.includes(document.activeElement)) input.focus();
}

function nextEmptyIndex() {
  const next = digits.findIndex((input) => !input.value);
  return next === -1 ? digits.length : next;
}

function markNext() {
  const started = digits.some((input) => input.value);
  const next = started ? nextEmptyIndex() : -1;
  digits.forEach((input, index) => input.classList.toggle("next", index === next));
}

function look(digit) {
  let [x, y] = DIRECTIONS[digit] ?? [0, 0];
  /* Diagonals would otherwise reach further than the straight directions. */
  const length = Math.hypot(x, y);
  if (length > 1) {
    x /= length;
    y /= length;
  }
  eyes.style.setProperty("--dx", `${x * REACH_X}px`);
  eyes.style.setProperty("--dy", `${y * REACH_Y}px`);
}

function flagMiss() {
  digitGroup.classList.remove("shake");
  void digitGroup.offsetWidth;
  digitGroup.classList.add("shake", "error");
}

function cancelPending() {
  clearTimeout(clearTimer);
  clearTimer = null;
  digitGroup.classList.remove("error");
}

function reset() {
  cancelPending();
  clearTimeout(lingerTimer);
  look(null);
  digits.forEach((input) => (input.value = ""));
  focusIfTyping(digits[0]);
  markNext();
}

function remember(code, word) {
  const row = list.insertRow();
  row.insertCell().textContent = code;
  row.insertCell().textContent = word;
  historyEl.hidden = false;
}

function submit() {
  const code = digits.map((input) => input.value).join("");
  const word = words[code];
  if (word) {
    output.textContent = word;
    remember(code, word);
  } else {
    output.textContent = "Word not found.";
    flagMiss();
  }
  clearTimer = setTimeout(reset, SETTLE_MS);
}

function enter(digit, index) {
  if (clearTimer) {
    reset();
    index = 0;
  }

  digits[index].value = digit;
  focusIfTyping(digits[Math.min(index + 1, digits.length - 1)]);
  markNext();

  if (digits.every((input) => input.value)) submit();
}

function deleteLast() {
  cancelPending();

  const last = nextEmptyIndex() - 1;
  if (last < 0) return;

  digits[last].value = "";
  focusIfTyping(digits[last]);
  markNext();
}

digits.forEach((input, index) => {
  input.addEventListener("focus", () => input.select());

  input.addEventListener("input", () => {
    const digit = input.value.replace(/[^0-8]/g, "").slice(-1);
    input.value = digit;
    if (digit) enter(digit, index);
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "Backspace") return;
    event.preventDefault();
    deleteLast();
  });
});

backspace?.addEventListener("click", deleteLast);

pad.addEventListener("click", (event) => {
  const key = event.target.closest(".key");
  if (!key) return;
  const next = nextEmptyIndex();
  enter(key.dataset.digit, next === digits.length ? 0 : next);
});

function preview(event) {
  const key = event.target.closest(".key");
  if (!key) return;
  clearTimeout(lingerTimer);
  look(key.dataset.digit);
}

function recentre() {
  clearTimeout(lingerTimer);
  lingerTimer = setTimeout(() => look(null), SETTLE_MS);
}

pad.addEventListener("pointerover", preview);

/*
  On some phones a tap focuses the key after the pointer has left, and previewing on that would
  cancel the pending recentre and strand the pupils, so only keyboard focus counts.
*/
pad.addEventListener("focusin", (event) => {
  if (event.target.matches(":focus-visible")) preview(event);
});
pad.addEventListener("pointerout", recentre);
pad.addEventListener("focusout", recentre);

markNext();
