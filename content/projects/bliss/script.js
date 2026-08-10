import words from "./words.js";

const SETTLE_MS = 500;

/*
  How far a pupil travels inside its eye, in the SVG's own units. The eyes are 26 by 19
  with a pupil radius of 8, so this stops a little short of the rim.
*/
const REACH_X = 15;
const REACH_Y = 8;

/*
  The direction each digit stands for, as seen by whoever is watching the eyes. */
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

/*
  Non-null only while a finished code is still on screen waiting to wipe itself. The miss
  styling is only ever set alongside it and cleared alongside it, so anything that clears
  this has already cleared that.
*/
let clearTimer = null;
let lingerTimer;

/*
  Chasing the caret is only wanted when the user is already typing. Focusing a box that
  nothing was focused in raises the on-screen keyboard, which on a phone covers the pad
  that was just tapped.
*/
function focusIfTyping(input) {
  if (digits.includes(document.activeElement)) input.focus();
}

/* Stands in for the caret while the pad is driving and no box is focused. */
function markNext() {
  const next = digits.findIndex((input) => !input.value);
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

/* Removing first restarts the animation when the same miss happens twice running. */
function flagMiss() {
  digitGroup.classList.remove("shake");
  void digitGroup.offsetWidth;
  digitGroup.classList.add("shake", "error");
}

function reset() {
  clearTimeout(clearTimer);
  clearTimer = null;
  /* A new word always starts from a level gaze, whatever the pad was last pointed at. */
  clearTimeout(lingerTimer);
  look(null);
  digits.forEach((input) => (input.value = ""));
  digitGroup.classList.remove("error");
  focusIfTyping(digits[0]);
  markNext();
}

function remember(code, word) {
  const row = document.createElement("tr");
  const codeCell = document.createElement("td");
  const wordCell = document.createElement("td");
  codeCell.textContent = code;
  wordCell.textContent = word;
  row.append(codeCell, wordCell);
  list.append(row);
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

/* Always clears the last digit entered, whichever box happens to hold the caret. */
function deleteLast() {
  clearTimeout(clearTimer);
  clearTimer = null;
  digitGroup.classList.remove("error");

  const next = digits.findIndex((input) => !input.value);
  const last = (next === -1 ? digits.length : next) - 1;
  if (last < 0) return;

  digits[last].value = "";
  focusIfTyping(digits[last]);
  markNext();
}

digits.forEach((input, index) => {
  /* Selecting on focus lets a digit be typed straight over the one already there. */
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

backspace.addEventListener("click", deleteLast);

pad.addEventListener("click", (event) => {
  const key = event.target.closest(".key");
  if (!key) return;
  const next = digits.findIndex((input) => !input.value);
  enter(key.dataset.digit, next === -1 ? 0 : next);
});

function preview(event) {
  const key = event.target.closest(".key");
  if (!key) return;
  clearTimeout(lingerTimer);
  look(key.dataset.digit);
}

/* Holding the direction a moment longer also rides over the gap between two keys. */
function recentre() {
  clearTimeout(lingerTimer);
  lingerTimer = setTimeout(() => look(null), SETTLE_MS);
}

pad.addEventListener("pointerover", preview);

/*
  Tapping a key focuses it on some phones, and that focus lands after the pointer has
  already left. Previewing on it would cancel the pending recentre and strand the pupils
  off to one side, so only a focus the browser treats as keyboard driven counts.
*/
pad.addEventListener("focusin", (event) => {
  if (event.target.matches(":focus-visible")) preview(event);
});
pad.addEventListener("pointerout", recentre);
pad.addEventListener("focusout", recentre);

markNext();
