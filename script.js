const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const pauseBtn = document.getElementById('pauseButton');
const gridCheckbox = document.getElementById('gridCheckbox');

const W = canvas.width = 500;
const H = canvas.height = 500;

const SIZE = 10;
const GRID_SIZE = W/SIZE;

let isRunning = false;

let showGrid = gridCheckbox.checked;

let cells = new Array(GRID_SIZE*GRID_SIZE).fill(false);
let tempcells = new Array(GRID_SIZE*GRID_SIZE).fill(false);

function indexOf(x, y) {
  return x + y*GRID_SIZE;
}

function countNeighbours(x, y) {
  let count = 0;
  for(let i=-1; i<=1; i++) {
    for(let j=-1; j<=1; j++) {
      if(j === 0 && i === 0 ) continue;

      const nx = (x + j + GRID_SIZE) % GRID_SIZE;
      const ny = (y + i + GRID_SIZE) % GRID_SIZE;

      count += cells[indexOf(nx, ny)];
    } 
  }
  
  return count;
}

function update() {
  for(let i=0; i<GRID_SIZE; i++) {
    for(let j=0; j<GRID_SIZE; j++) {
      const index = indexOf(j, i);
      const neighbours = countNeighbours(j, i);
      tempcells[index] = neighbours === 3 || (cells[index] && neighbours === 2);
    }
  }

  [cells, tempcells] = [tempcells, cells];
  tempcells = tempcells.fill(false);

  if(!isRunning) draw();
}

function line(fromX, fromY, toX, toY) {
  ctx.save();
  ctx.strokeStyle = 'rgb(123, 123, 123)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, W, H);
  
  ctx.fillStyle = 'white';
  for(let i=0; i<GRID_SIZE; i++) {
    for(let j=0; j<GRID_SIZE; j++) {
      if(!cells[indexOf(j, i)]) continue;
      ctx.fillRect(SIZE*j, SIZE*i, SIZE, SIZE);
    }
    if(showGrid) {
      line(i*SIZE, 0, i*SIZE, H);
      line(0, i*SIZE, W, i*SIZE);
    }
  }
}

let lastUpdate = 0;
function loop(time) {
  if(!isRunning) return;
  if(time - lastUpdate >= 16) {
    update();
    draw();
    lastUpdate = time;
  }
  requestAnimationFrame(loop);
}

function pause() {
  isRunning = false;
  pauseBtn.textContent = 'Start';
}

function start() {
  if(isRunning) return;
  isRunning = true;
  pauseBtn.textContent = 'Pause';
  loop();
}

function togglePause() {
  if(isRunning) {
    pause();
  } else {
    start();
  }
}

function toggleGrid(el) {
  if(el.checked) {
    showGrid = true;
  } else {
    showGrid = false;
  }

  draw();
}

function reset() {
  pause();
  cells.fill(false);
  tempcells.fill(false);
  draw();
}

draw();

canvas.addEventListener('click', (ev) => {
  const x = Math.floor( ev.offsetX / SIZE );
  const y = Math.floor( ev.offsetY / SIZE );

  const i = indexOf(x, y);
  if(!isRunning) {
    tempcells[i] = !cells[i];
    cells[i] = !cells[i];
  }
  draw();

});