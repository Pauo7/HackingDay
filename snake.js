"use strict";

const SIZE = 20;
const SPEED_INCREMENT = 10; 
const SKINS = {
  default: "#60a5fa",
  green: "#10b981",
  pink: "#f472b6"
};
const SECRET = "192.16";

const gridEl = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const speedEl = document.getElementById("speed");
const secretEl = document.getElementById("secret-key");

let direction = { x: 1, y: 0 }; 
let nextDirection = { ...direction }; 
let snake = [
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 }
];
let food = null;
let score = 0;
let speedMs = 200;
let tick = null;
let skin = SKINS.default; 

function initGridDOM() {
  gridEl.innerHTML = "";
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.x = x;
      cell.dataset.y = y;
      gridEl.appendChild(cell);
    }
  }
}

function inBounds(x, y) {
  return x >= 0 && x < SIZE && y >= 0 && y < SIZE;
}

function samePos(a, b) {
  return a.x === b.x && a.y === b.y;
}

function render() {
  const cells = gridEl.querySelectorAll(".cell");

  cells.forEach(cell => {
    cell.className = "cell";
    cell.style.backgroundColor = "#0b1224"; 
  });

  snake.forEach(part => {
    const idx = part.y * SIZE + part.x;
    cells[idx].classList.add("snake");
    cells[idx].style.backgroundColor = skin;
  });

  if (food !== null) {
    const idx = food.y * SIZE + food.x;
    cells[idx].classList.add("food");
    cells[idx].style.backgroundColor = "#f87171";
  }
}

function placeFood() {
  let valid = false;
  while (!valid) {
    const x = Math.floor(Math.random() * SIZE);
    const y = Math.floor(Math.random() * SIZE);
    const pos = { x, y };
    valid = !snake.some(part => samePos(part, pos));
    if (valid) food = pos;
  }
}

function updateSecret(score) {
  const lettersToShow = Math.floor(score / 3); 
  const spans = document.querySelectorAll("#secretKey span");
  spans.forEach((span, i) => {
    if (i < lettersToShow) {
      span.textContent = SECRET[i]; 
    } else {
      span.textContent = "_"; 
    }
  });
}

function step() {

  direction = { ...nextDirection };

  const head = snake[0];
  const next = { x: head.x + direction.x, y: head.y + direction.y };

  if (!inBounds(next.x, next.y)) {
    gameOver();
    return;
  }

  if (snake.some(part => samePos(part, next))) {
    gameOver();
    return;
  }

  snake.unshift(next);

  if (food !== null && samePos(next, food)) {
    score++;
    scoreEl.textContent = score;
    placeFood();

    if (score % 2 === 0) {
      speedMs = Math.max(120, speedMs - SPEED_INCREMENT); 
      speedEl.textContent = speedMs;

      if (tick) {
        clearInterval(tick);
        tick = setInterval(step, speedMs);
      }
    }

    updateSecret(score);

  } else {

    snake.pop();
  }

  render();
}

function start() {
  initGridDOM();
  scoreEl.textContent = score;
  speedEl.textContent = speedMs;
  updateSecret(score); 

  placeFood();
  render();

  tick = setInterval(step, speedMs);
}

function gameOver() {
  if (tick) clearInterval(tick);
  tick = null;
  alert("Game Over");
}

document.addEventListener("keydown", function (e) {

  if (e.key === "ArrowUp" && direction.y !== 1) nextDirection = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y !== -1) nextDirection = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x !== 1) nextDirection = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x !== -1) nextDirection = { x: 1, y: 0 };
});

function setSnakeSkin(colorName) {
  if (SKINS[colorName]) skin = SKINS[colorName];
}

start();
