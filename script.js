const puzzle = document.getElementById('puzzle');
const startBtn = document.getElementById('startBtn');
const difficultySelect = document.getElementById('difficulty');
const message = document.getElementById('message');
const timerEl = document.getElementById('timer');
const movesEl = document.getElementById('moves');

let tiles = [];
let emptyIndex = 8;
let moveCount = 0;
let timer = 0;
let timerInterval;

const movesPerDifficulty = {
  easy: 10,
  medium: 30,
  hard: 100,
};

function createTiles() {
  puzzle.innerHTML = '';
  tiles = [];

  for (let i = 0; i < 9; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    tile.setAttribute('draggable', true);
    if (i === 8) {
      tile.classList.add('empty');
    } else {
      const x = (i % 3) * 100;
      const y = Math.floor(i / 3) * 100;
      tile.style.backgroundPosition = `-${x}% -${y}%`;
    }
    // Mouse-based drag
    tile.addEventListener('click', () => moveTile(i));
    tile.addEventListener('dragstart', (e) => handleDragStart(e, i));
    tile.addEventListener('dragover', (e) => e.preventDefault());
    tile.addEventListener('drop', (e) => handleDrop(e, i));

  // Touch support for mobile drag
    tile.addEventListener('touchstart', (e) => handleTouchStart(e, i), { passive: true });
    tile.addEventListener('touchend', (e) => handleTouchEnd(e, i));

    puzzle.appendChild(tile);
    tiles.push(tile);
  }
}

function moveTile(index) {
  if (isAdjacent(index, emptyIndex)) {
    swapTiles(index, emptyIndex);
    emptyIndex = index;
    moveCount++;
    movesEl.textContent = `Moves: ${moveCount}`;
    checkWin();
  }
}

function isAdjacent(i1, i2) {
  const x1 = i1 % 3, y1 = Math.floor(i1 / 3);
  const x2 = i2 % 3, y2 = Math.floor(i2 / 3);
  return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
}

function swapTiles(i1, i2) {
  const tempBg = tiles[i1].style.backgroundPosition;
  tiles[i1].style.backgroundPosition = tiles[i2].style.backgroundPosition;
  tiles[i2].style.backgroundPosition = tempBg;

  tiles[i1].classList.toggle('empty');
  tiles[i2].classList.toggle('empty');
}

function shuffleTiles(moves = 30) {
  let directions = [-1, 1, -3, 3];
  for (let i = 0; i < moves; i++) {
    let validMoves = directions.map(d => emptyIndex + d)
      .filter(idx => idx >= 0 && idx < 9 && isAdjacent(idx, emptyIndex));
    let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
    swapTiles(randomMove, emptyIndex);
    emptyIndex = randomMove;
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = `Time: ${timer}s`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function checkWin() {
  for (let i = 0; i < 8; i++) {
    const x = (i % 3) * 100;
    const y = Math.floor(i / 3) * 100;
    if (tiles[i].style.backgroundPosition !== `-${x}% -${y}%`) {
      return;
    }
  }
  message.classList.remove('hidden');
  stopTimer();
}

function handleDragStart(e, index) {
  e.dataTransfer.setData('text/plain', index);
}

function handleDrop(e, index) {
  const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
  if (index === emptyIndex && isAdjacent(fromIndex, emptyIndex)) {
    swapTiles(fromIndex, emptyIndex);
    emptyIndex = fromIndex;
    moveCount++;
    movesEl.textContent = `Moves: ${moveCount}`;
    checkWin();
  }
}

let touchStartIndex = null;

function handleTouchStart(e, index) {
  touchStartIndex = index;
}

function handleTouchEnd(e, index) {
  if (touchStartIndex !== null && index === emptyIndex && isAdjacent(touchStartIndex, emptyIndex)) {
    swapTiles(touchStartIndex, emptyIndex);
    emptyIndex = touchStartIndex;
    moveCount++;
    movesEl.textContent = `Moves: ${moveCount}`;
    checkWin();
  }
  touchStartIndex = null;
}


startBtn.addEventListener('click', () => {
  createTiles();
  emptyIndex = 8;
  moveCount = 0;
  movesEl.textContent = `Moves: 0`;
  message.classList.add('hidden');

  const difficulty = difficultySelect.value;
  shuffleTiles(movesPerDifficulty[difficulty]);
  startTimer();
});

// Start immediately
createTiles();
