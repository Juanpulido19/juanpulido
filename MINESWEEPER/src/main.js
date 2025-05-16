document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector('.grid');
  const flagsLeft = document.querySelector('#flags-left');
  const width = 10;
  const result = document.querySelector('#result');
  let bombAmount = 20;
  let squares = [];
  let gameOver = false;

  // Create board
  function createBoard() {
    flagsLeft.innerHTML = bombAmount;

    // Generate game array with random bombs
    const bombArray = Array(bombAmount).fill('bomb');
    const emptyArray = Array(width * width - bombAmount).fill('valid');
    const gameArray = emptyArray.concat(bombArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.id = i;
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      // Normal click
      square.addEventListener('click', () => {
        click(square);
      });

      // Right click (flagging)
      square.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        addFlag(square);
      });
    }

    // Add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains('valid')) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++;
        if (i > 9 && !isRightEdge && squares[i + 1 - width]?.classList.contains('bomb')) total++;
        if (i > 10 && squares[i - width]?.classList.contains('bomb')) total++;
        if (i > 11 && !isLeftEdge && squares[i - width - 1]?.classList.contains('bomb')) total++;
        if (i < 99 && !isRightEdge && squares[i + 1]?.classList.contains('bomb')) total++;
        if (i < 90 && !isLeftEdge && squares[i - 1 + width]?.classList.contains('bomb')) total++;
        if (i < 88 && !isRightEdge && squares[i + 1 + width]?.classList.contains('bomb')) total++;
        if (i < 89 && squares[i + width]?.classList.contains('bomb')) total++;

        if (total > 0) {
          squares[i].setAttribute('data', total);
        }
      }
    }
  }

  createBoard();

  // Handle click event
  function click(square) {
    if (gameOver) return;
    if (square.classList.contains('checked') || square.classList.contains('flag')) return;

    if (square.classList.contains('bomb')) {
      handleGameOver(square);
      return;
    }

    square.classList.add('checked');
    const total = square.getAttribute('data');
    if (total) {
      square.innerHTML = total;
      return;
    }

    // Reveal surrounding squares if no bomb is nearby
    checkSquare(square);
  }

  function checkSquare(square) {
    const squareId = parseInt(square.id);
    const isLeftEdge = squareId % width === 0;
    const isRightEdge = squareId % width === width - 1;

    setTimeout(() => {
      if (squareId > 0 && !isLeftEdge) click(squares[squareId - 1]);
      if (squareId > 9 && !isRightEdge) click(squares[squareId + 1 - width]);
      if (squareId > 10) click(squares[squareId - width]);
      if (squareId > 11 && !isLeftEdge) click(squares[squareId - width - 1]);
      if (squareId < 99 && !isRightEdge) click(squares[squareId + 1]);
      if (squareId < 90 && !isLeftEdge) click(squares[squareId - 1 + width]);
      if (squareId < 88 && !isRightEdge) click(squares[squareId + 1 + width]);
      if (squareId < 89) click(squares[squareId + width]);
    }, 10);
  }

  // Handle game over
  function handleGameOver(clickedSquare) {
    result.innerHTML = 'BOOM! Game Over!';
    gameOver = true;

    // Show all bombs
    squares.forEach((square) => {
      if (square.classList.contains('bomb')) {
        square.innerHTML = '💣';
        square.classList.add('checked');
      }
    });

    clickedSquare.classList.add('exploded');
  }

  // Handle flagging
  function addFlag(square) {
    if (gameOver) return;
    if (!square.classList.contains('checked') && bombAmount > 0) {
      if (!square.classList.contains('flag')) {
        square.classList.add('flag');
        square.innerHTML = '🚩';
        bombAmount--;
        flagsLeft.innerHTML = bombAmount;
      } else {
        square.classList.remove('flag');
        square.innerHTML = '';
        bombAmount++;
        flagsLeft.innerHTML = bombAmount;
      }
    }
  }
});