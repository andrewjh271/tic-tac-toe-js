const board = (() => {
  const squares = [];

  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function move(marker, position) {
    if (squares[position]) return false;

    squares[position] = marker;
    return true;
  }

  function findWin() {
    return lines.find((line) =>
      line
        .map((index) => squares[index])
        .reduce((acc, cur) => (acc === cur ? acc : null))
    );
  }

  function getValue(index) {
    return squares[index];
  }

  return { move, findWin, getValue };
})();

const gamePlay = (() => {
  let xToMove = true;

  function switchPlayer() {
    xToMove = !xToMove;
  }

  function updateStatus(params) {
    const winningLine = board.findWin();
    if (winningLine) {
      displayController.displayBoard();
      displayController.displayWin(winningLine);
    } else {
      switchPlayer();
      displayController.makeUnavailable(params.lastMove);
      displayController.displayBoard();
    }
  }

  function move(e) {
    const { index } = e.target.dataset;
    const marker = xToMove ? 'X' : 'O';
    board.move(marker, index);
    updateStatus({ lastMove: index });
  }

  return { move };
})();

const displayController = (() => {
  const squares = document.querySelectorAll('.square');
  squares.forEach((square) => square.addEventListener('click', gamePlay.move));

  function displayBoard() {
    squares.forEach((square, i) => {
      const marker = board.getValue(i);
      if (marker) {
        square.innerHTML = `<img src='/images/${marker}.svg'>`;
      }
    });
  }

  function displayWin(winningLine) {
    makeUnavailableAll();
    winningLine.forEach((index) => {
      squares[index].classList.add('winning-line');
    });
  }

  function makeUnavailable(index) {
    lastMove = squares[index];
    lastMove.removeEventListener('click', gamePlay.move);
    lastMove.classList.add('unavailable');
  }

  function makeUnavailableAll() {
    squares.forEach((square) => {
      square.removeEventListener('click', gamePlay.move);
      square.classList.add('unavailable');
    });
  }

  return { makeUnavailable, displayBoard, displayWin };
})();
