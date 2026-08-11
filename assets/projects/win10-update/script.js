const spinnerEl = document.getElementById("spinner");
const statusEl = document.getElementById("msg1");
const percentEl = document.getElementById("msg2");
const warningEl = document.getElementById("msg3");

const SPINNER_FIRST = 0xe052;
const SPINNER_LAST = 0xe0cb;
const FINAL_PERCENT = 30;

let frame = SPINNER_FIRST;
setInterval(() => {
  spinnerEl.textContent = String.fromCharCode(frame);
  frame = frame === SPINNER_LAST ? SPINNER_FIRST : frame + 1;
}, 1000 / 30);

setTimeout(() => {
  statusEl.textContent = "Getting Windows ready";
  warningEl.style.display = "block";
}, 5000);

setTimeout(() => {
  statusEl.textContent = "Working on updates";
  percentEl.textContent = "0% complete";

  let percent = 1;
  const counter = setInterval(() => {
    percentEl.textContent = `${percent}% complete`;
    if (percent === FINAL_PERCENT) clearInterval(counter);
    percent++;
  }, 10000);
}, 15000);
