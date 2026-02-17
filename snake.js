"use strict";

/* --- CONSTANTS ----------------------------------------------------------- */
const SIZE = 20;
const SPEED_INCREMENT = 10; // cada 2 pomes, reduïm l'interval en 10ms
const SKINS = {
  default: "#60a5fa",
  green: "#10b981",
  pink: "#f472b6"
};
const SECRET = "192.16";

/* --- ELEMENTS DEL DOM ---------------------------------------------------- */
const gridEl = document.getElementById("grid");
const scoreEl = document.getElementById("score");
const speedEl = document.getElementById("speed");
const secretEl = document.getElementById("secret-key");

/* --- ESTAT DEL JOC ------------------------------------------------------- */
let direction = { x: 1, y: 0 }; // inicialment cap a la dreta
let nextDirection = { ...direction }; // per evitar doble moviment
let snake = [
  { x: 9, y: 10 },
  { x: 8, y: 10 },
  { x: 7, y: 10 }
];
let food = null;
let score = 0;
let speedMs = 200;
let tick = null;
let skin = SKINS.default; // skin de la serp

/* ========================================================================== */
/* -------------------------- FUNCIONS D'AJUDA ----------------------------- */
/* ========================================================================== */

/** Crea el tauler visual 20x20 */
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

/** Retorna true si (x,y) és dins del tauler */
function inBounds(x, y) {
  return x >= 0 && x < SIZE && y >= 0 && y < SIZE;
}

/** Compara dues posicions {x,y} */
function samePos(a, b) {
  return a.x === b.x && a.y === b.y;
}

/** Dibuixa la serp i el menjar */
function render() {
  const cells = gridEl.querySelectorAll(".cell");

  // neteja totes les cel·les
  cells.forEach(cell => {
    cell.className = "cell";
    cell.style.backgroundColor = "#0b1224"; // reset
  });

  // pinta la serp amb la skin
  snake.forEach(part => {
    const idx = part.y * SIZE + part.x;
    cells[idx].classList.add("snake");
    cells[idx].style.backgroundColor = skin;
  });

  // pinta el menjar
  if (food !== null) {
    const idx = food.y * SIZE + food.x;
    cells[idx].classList.add("food");
    cells[idx].style.backgroundColor = "#f87171";
  }
}

/* ========================================================================== */
/* ----------------------------- LÒGICA DEL JOC ----------------------------- */
/* ========================================================================== */

/** Col·loca menjar aleatori dins del tauler (sense sobreposar-se a la serp) */
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

/** Actualitza la clau secreta mostrant les primeres N lletres */
function updateSecret(score) {
  const lettersToShow = Math.floor(score / 5); // 1 lletra per cada 5 pomes
  const spans = document.querySelectorAll("#secretKey span");
  spans.forEach((span, i) => {
    if (i < lettersToShow) {
      span.textContent = SECRET[i]; // mostra la lletra
    } else {
      span.textContent = "_"; // encara bloquejada
    }
  });
}


/** Un pas del joc: mou la serp, comprova col·lisions i menjar */
function step() {
  // actualitza la direcció amb la propera (aplicant gir)
  direction = { ...nextDirection };

  const head = snake[0];
  const next = { x: head.x + direction.x, y: head.y + direction.y };

  // col·lisió amb paret
  if (!inBounds(next.x, next.y)) {
    gameOver();
    return;
  }

  // col·lisió amb el propi cos
  if (snake.some(part => samePos(part, next))) {
    gameOver();
    return;
  }

  // afegim el nou cap
  snake.unshift(next);

  // si ha menjat
  if (food !== null && samePos(next, food)) {
    score++;
    scoreEl.textContent = score;
    placeFood(); // generar nou menjar

    // augmentar velocitat cada 2 pomes
    if (score % 2 === 0) {
      speedMs = Math.max(120, speedMs - SPEED_INCREMENT); // no deixar <50ms
      speedEl.textContent = speedMs;

      // reinicia l'interval amb la nova velocitat
      if (tick) {
        clearInterval(tick);
        tick = setInterval(step, speedMs);
      }
    }

    // **actualitzar clau secreta**
    updateSecret(score);

  } else {
    // no ha menjat → eliminar la cua
    snake.pop();
  }

  render();
}

/** Arrenca el joc */
function start() {
  initGridDOM();
  scoreEl.textContent = score;
  speedEl.textContent = speedMs;
  updateSecret(score); // inicialitza la clau secreta

  placeFood(); // inicialitzar menjar
  render();

  tick = setInterval(step, speedMs);
}

/** Finalitza la partida */
function gameOver() {
  if (tick) clearInterval(tick);
  tick = null;
  alert("Game Over");
}

/* ========================================================================== */
/* ---------------------------- CONTROLS DE TECLAT ------------------------- */
/* ========================================================================== */
document.addEventListener("keydown", function (e) {
  // **No permet girar 180º**
  if (e.key === "ArrowUp" && direction.y !== 1) nextDirection = { x: 0, y: -1 };
  if (e.key === "ArrowDown" && direction.y !== -1) nextDirection = { x: 0, y: 1 };
  if (e.key === "ArrowLeft" && direction.x !== 1) nextDirection = { x: -1, y: 0 };
  if (e.key === "ArrowRight" && direction.x !== -1) nextDirection = { x: 1, y: 0 };
});

/* ========================================================================== */
/* ---------------------------- FUNCIONS ADDICIONALS ----------------------- */
/* ========================================================================== */

/** Canvia la skin de la serp */
function setSnakeSkin(colorName) {
  if (SKINS[colorName]) skin = SKINS[colorName];
}

/* --- INICI --------------------------------------------------------------- */
start();

// Exemple: canviar la skin a verda
// setSnakeSkin("green");
