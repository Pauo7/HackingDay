"use strict";

/* --- CONSTANTS I ELEMENTS --- */
const COLS = 10, ROWS = 22;
const boardEl = document.getElementById("board");
const linesEl = document.getElementById("lines");
const pieceNameEl = document.getElementById("pieceName");
const holdPreview = document.getElementById("holdPreview");
const holdName = document.getElementById("holdName");
const pauseBtn = document.getElementById("pauseBtn");
const nextEls = [document.getElementById("next1"), document.getElementById("next2"), document.getElementById("next3")];
const secretKeyEl = document.getElementById("secretKey");

const TETROMINOS = [
  { name: "I", cls: "tI", blocks: [[0,1],[1,1],[2,1],[3,1]] },
  { name: "J", cls: "tJ", blocks: [[0,0],[0,1],[1,1],[2,1]] },
  { name: "L", cls: "tL", blocks: [[2,0],[0,1],[1,1],[2,1]] },
  { name: "O", cls: "tO", blocks: [[1,0],[2,0],[1,1],[2,1]] },
  { name: "S", cls: "tS", blocks: [[1,0],[2,0],[0,1],[1,1]] },
  { name: "T", cls: "tT", blocks: [[1,0],[0,1],[1,1],[2,1]] },
  { name: "Z", cls: "tZ", blocks: [[0,0],[1,0],[1,1],[2,1]] },
];

let board = Array.from({length:ROWS},()=>Array(COLS).fill(null));
let current = createPiece();
let next1 = createPiece();
let next2 = createPiece();
let next3 = createPiece();
let hold = null;
let holdUsed = false;
let lines = 0;
let speed = 500;
let tick = null;
let paused = false;

/* --- FUNCIONS --- */
function createPiece(){
  const t = TETROMINOS[Math.floor(Math.random()*TETROMINOS.length)];
  return { name:t.name, cls:t.cls, x:3, y:0, blocks:t.blocks.map(b=>[b[0],b[1]]) };
}

function inBounds(x,y){ return x>=0 && x<COLS && y>=0 && y<ROWS; }

function canMove(piece,dx,dy,blocksOverride){
  const blocks = blocksOverride??piece.blocks;
  for(const [bx,by] of blocks){
    const nx=piece.x+bx+dx;
    const ny=piece.y+by+dy;
    if(!inBounds(nx,ny)||board[ny][nx]!==null) return false;
  }
  return true;
}

function rotateBlocks(blocks){
  const rotated = blocks.map(([x,y])=>[-y,x]);
  const minX=Math.min(...rotated.map(b=>b[0]));
  const minY=Math.min(...rotated.map(b=>b[1]));
  return rotated.map(([x,y])=>[x-minX,y-minY]);
}

function lockPiece(piece){
  for(const [bx,by] of piece.blocks){
    const x=piece.x+bx, y=piece.y+by;
    if(inBounds(x,y)) board[y][x]=piece.cls;
  }
}

function clearLines(){
  let clearedThisTick=0;
  for(let r=ROWS-1;r>=0;r--){
    if(board[r].every(v=>v!==null)){
      board.splice(r,1);
      board.unshift(Array(COLS).fill(null));
      clearedThisTick++;
      r++;
    }
  }
  if(clearedThisTick>0){
    lines+=clearedThisTick;
    linesEl.textContent=lines;
    updateSpeed();
    updateSecretKey();
  }
}

function updateSpeed(){
  const factor=Math.floor(lines/2);
  speed=Math.max(100,500*Math.pow(0.95,factor));
  if(tick){ clearInterval(tick); tick=setInterval(step,speed); }
}

function step(){
  if(paused) return;
  if(canMove(current,0,1)) current.y++;
  else{
    lockPiece(current); clearLines();
    current = next1;
    next1 = next2;
    next2 = next3;
    next3 = createPiece();
    holdUsed=false;
    pieceNameEl.textContent=current.name;
    if(!canMove(current,0,0)){ stop(); alert("Game Over"); return; }
  }
  render(); renderNext(); renderHold();
}

function render(){
  boardEl.innerHTML="";
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const cell=document.createElement("div");
      cell.className="cell";
      if(board[r][c]) cell.classList.add("filled",board[r][c]);
      boardEl.appendChild(cell);
    }
  }
  for(const [bx,by] of current.blocks){
    const x=current.x+bx, y=current.y+by;
    if(inBounds(x,y)){
      const idx=y*COLS+x;
      boardEl.children[idx].classList.add("filled",current.cls);
    }
  }
}

function renderNext(){
  const nextArr=[next1,next2,next3];
  for(let i=0;i<3;i++){
    const nextEl=nextEls[i]; nextEl.innerHTML="";
    const grid=Array.from({length:4},()=>Array(4).fill(null));
    for(const [x,y] of nextArr[i].blocks) grid[y][x]=nextArr[i].cls;
    for(let y=0;y<4;y++)
      for(let x=0;x<4;x++){
        const cell=document.createElement("div");
        cell.className="cell";
        if(grid[y][x]) cell.classList.add("filled",grid[y][x]);
        nextEl.appendChild(cell);
      }
  }
}

function renderHold(){
  holdPreview.innerHTML="";
  if(!hold) return;
  const grid=Array.from({length:4},()=>Array(4).fill(null));
  for(const [x,y] of hold.blocks) grid[y][x]=hold.cls;
  for(let y=0;y<4;y++)
    for(let x=0;x<4;x++){
      const cell=document.createElement("div");
      cell.className="cell";
      if(grid[y][x]) cell.classList.add("filled",grid[y][x]);
      holdPreview.appendChild(cell);
    }
  holdName.textContent=hold.name;
}

function holdPiece(){
  if(holdUsed) return;
  if(!hold){ hold=current; current=createPiece(); }
  else { [hold,current] = [current, hold]; current.x=3; current.y=0; }
  holdUsed=true; renderHold();
}

function updateSecretKey(){
  const spans=secretKeyEl.querySelectorAll("span");
  const secret=["8",".","0",".","1","3","5"];
  spans.forEach((s,i)=>{ s.textContent="_"; s.classList.remove("unlocked"); });
  spans.forEach((s,i)=>{ if(lines>=i+1){ s.textContent=secret[i]; s.classList.add("unlocked"); } });
}

function start(){
  tick=setInterval(step,speed);
  render(); renderNext(); renderHold();
}

function stop(){ if(tick){ clearInterval(tick); tick=null; } }

/* --- CONTROLS --- */
document.addEventListener("keydown", e=>{
  if(paused) return;
  if(e.key==="ArrowUp"){ const rotated=rotateBlocks(current.blocks); if(canMove(current,0,0,rotated)){ current.blocks=rotated; render(); } }
  if(e.key==="ArrowRight" && canMove(current,1,0)){ current.x++; render(); }
  if(e.key==="ArrowLeft" && canMove(current,-1,0)){ current.x--; render(); }
  if(e.key==="ArrowDown" && canMove(current,0,1)){ current.y++; render(); }
  if(e.key==="c" || e.key==="C"){ holdPiece(); }
});

/* --- PAUSA BOTÓ --- */
pauseBtn.addEventListener("click", ()=>{
  paused=!paused;
  if(paused){
    pauseBtn.innerHTML = '<img src="replay.png" alt="Reprendre" width="24" height="24">';
} else {
    pauseBtn.innerHTML = '<img src="pausa.png" alt="Pausa" width="24" height="24">';
}

});

start();
