"use strict";

/* --- CONSTANTS DEL JOC --------------------------------------------------- */
const COLS = 10;
const ROWS = 20;

/* --- ELEMENTS DEL DOM ---------------------------------------------------- */
const boardEl = document.getElementById("board");
const linesEl = document.getElementById("lines");
const pieceNameEl = document.getElementById("pieceName");

/* --- ESTAT DEL TAULER ---------------------------------------------------- */
const board = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => null));

/* --- DEFINICIÓ DE PECES (TETROMINOS) ------------------------------------- */
const TETROMINOS = [
  { name: "I", cls: "tI", blocks: [[0,1],[1,1],[2,1],[3,1]] },
  { name: "J", cls: "tJ", blocks: [[0,0],[0,1],[1,1],[2,1]] },
  { name: "L", cls: "tL", blocks: [[2,0],[0,1],[1,1],[2,1]] },
  { name: "O", cls: "tO", blocks: [[1,0],[2,0],[1,1],[2,1]] },
  { name: "S", cls: "tS", blocks: [[1,0],[2,0],[0,1],[1,1]] },
  { name: "T", cls: "tT", blocks: [[1,0],[0,1],[1,1],[2,1]] },
  { name: "Z", cls: "tZ", blocks: [[0,0],[1,0],[1,1],[2,1]] },
];

/* --- VARIABLES DE PARTIDA ------------------------------------------------ */
let current = createPiece();
let next = createPiece(); // peça següent
let tick = null;
let lines = 0;
let speed = 500; // ms per pas inicial

/* ========================================================================== */
/* --- FUNCIONS ------------------------------------------------------------ */
/* ========================================================================== */

function createPiece() {
  const t = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
  return {
    name: t.name,
    cls: t.cls,
    x: 3,
    y: 0,
    blocks: t.blocks.map(b => [b[0], b[1]])
  };
}

function initBoardDOM() {
  boardEl.innerHTML = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.r = String(r);
      cell.dataset.c = String(c);
      boardEl.appendChild(cell);
    }
  }
}

function inBounds(x, y) {
  return x >= 0 && x < COLS && y >= 0 && y < ROWS;
}

function canMove(piece, dx, dy, blocksOverride) {
  const blocks = blocksOverride ?? piece.blocks;
  for (const [bx, by] of blocks) {
    const nx = piece.x + bx + dx;
    const ny = piece.y + by + dy;
    if (!inBounds(nx, ny) || board[ny][nx] !== null) return false;
  }
  return true;
}

function rotateBlocks(blocks) {
  const rotated = blocks.map(([x, y]) => [-y, x]);
  const minX = Math.min(...rotated.map(b => b[0]));
  const minY = Math.min(...rotated.map(b => b[1]));
  return rotated.map(([x, y]) => [x - minX, y - minY]);
}

function lockPiece(piece) {
  for (const [bx, by] of piece.blocks) {
    const x = piece.x + bx;
    const y = piece.y + by;
    if (inBounds(x, y)) board[y][x] = piece.cls;
  }
}

function clearLines() {
  let clearedThisTick = 0;

  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(v => v !== null)) {
      board.splice(r, 1);
      board.unshift(Array.from({ length: COLS }, () => null));
      clearedThisTick++;
      r++;
    }
  }

  if (clearedThisTick > 0) {
    lines += clearedThisTick;
    linesEl.textContent = lines;
    updateSecretKey();
    updateSpeed();
  }
}

function step() {
  if (canMove(current, 0, 1)) {
    current.y += 1;
  } else {
    lockPiece(current);
    clearLines();
    current = next;
    next = createPiece();
    pieceNameEl.textContent = next.name;

    if (!canMove(current, 0, 0)) {
      stop();
      alert("Game Over");
      return;
    }
  }
  render();
}

function render() {
  const cells = boardEl.querySelectorAll(".cell");

  // Reset tauler
  cells.forEach(cell => {
    cell.className = "cell";
    const r = Number(cell.dataset.r);
    const c = Number(cell.dataset.c);
    const v = board[r][c];
    if (v !== null) cell.classList.add("filled", v);
  });

  // Pintar peça actual
  for (const [bx, by] of current.blocks) {
    const x = current.x + bx;
    const y = current.y + by;
    if (!inBounds(x, y)) continue;
    const idx = y * COLS + x;
    cells[idx].classList.add("filled", current.cls);
  }

  pieceNameEl.textContent = next.name;
}

function start() {
  initBoardDOM();
  render();
  tick = setInterval(step, speed);
}

function stop() {
  if (tick) clearInterval(tick);
  tick = null;
}

/* --- CONTROLS ------------------------------------------------------------ */
document.addEventListener("keydown", e => {
  if (!tick) return;

  if (e.key === "ArrowUp") {
    const rotated = rotateBlocks(current.blocks);
    if (canMove(current, 0, 0, rotated)) {
      current.blocks = rotated;
      render();
    }
  }
  if (e.key === "ArrowRight" && canMove(current, 1, 0)) { current.x += 1; render(); }
  if (e.key === "ArrowLeft" && canMove(current, -1, 0)) { current.x -= 1; render(); }
  if (e.key === "ArrowDown" && canMove(current, 0, 1)) { current.y += 1; render(); }
});

/* --- SECRET KEY ---------------------------------------------------------- */
function updateSecretKey() {
  const keyEl = document.getElementById("secretKey");
  if (!keyEl) return;
  const spans = keyEl.querySelectorAll("span");
  const secret = ["8",".","0",".","1","3","5"];

  spans.forEach((s, i) => {
    s.textContent = "_";
    s.classList.remove("unlocked");
  });

  spans.forEach((s, i) => {
    if (lines >= (i + 1)) {
      s.textContent = secret[i];
      s.classList.add("unlocked");
    }
  });
}

/* --- SPEED UP ------------------------------------------------------------ */
function updateSpeed() {
  const factor = Math.floor(lines / 2);
  speed = Math.max(100, 500 * Math.pow(0.95, factor));
  if (tick) {
    clearInterval(tick);
    tick = setInterval(step, speed);
  }
}

start();
