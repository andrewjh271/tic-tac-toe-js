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

  const move = (marker, position) => (squares[position] ||= marker);

  const getValue = (index) => squares[index];

  const findWin = () => {
    return lines.find((line) =>
      line
        .map((index) => squares[index])
        .reduce((acc, cur) => (acc === cur ? acc : null))
    );
  };

  const stalemate = () => {
    for (let i = 0; i < 9; i++) if (!squares[i]) return false;
    return true;
  };

  return { move, findWin, stalemate, getValue };
})();

const gamePlay = (() => {
  const status = document.querySelector('.status');
  let xToMove = true;

  const switchPlayer = () => (xToMove = !xToMove);

  const updateStatus = (params) => {
    const winningLine = board.findWin();
    displayController.displayBoard();
    if (winningLine) {
      status.innerHTML = xToMove ? '<h3>X Wins!</h3>' : '<h3>O Wins!</h3>';
      displayController.makeUnavailableAll();
      displayController.displayWin(winningLine);
    } else if (board.stalemate()) {
      status.innerHTML = "It's a draw!";
    } else {
      switchPlayer();
      displayController.makeUnavailable(params.lastMove);
    }
  };

  const move = (e) => {
    const { index } = e.target.dataset;
    const marker = xToMove ? 'X' : 'O';
    board.move(marker, index);
    updateStatus({ lastMove: index });
  };

  return { move };
})();

const displayController = (() => {
  const squares = document.querySelectorAll('.square');
  squares.forEach((square) => square.addEventListener('click', gamePlay.move));

  const displayBoard = () => {
    squares.forEach((square, i) => {
      const marker = board.getValue(i);
      if (marker) {
        square.innerHTML = `<img src='/images/${marker}.svg'>`;
      }
    });
  };

  const displayWin = (winningLine) =>
    winningLine.forEach((index) =>
      squares[index].classList.add('winning-line')
    );

  const makeUnavailable = (index) => {
    lastMove = squares[index];
    lastMove.removeEventListener('click', gamePlay.move);
    lastMove.classList.add('unavailable');
  };

  const makeUnavailableAll = () => {
    squares.forEach((square) => {
      square.removeEventListener('click', gamePlay.move);
      square.classList.add('unavailable');
    });
  };

  return { makeUnavailable, makeUnavailableAll, displayBoard, displayWin };
})();
