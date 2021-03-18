const board = (() => {
  let squares = [];

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
  const clear = () => squares = [];

  const findWin = () => {
    return lines.find((line) =>
      line
        .map((index) => squares[index])
        .reduce((acc, cur) => (acc === cur ? acc : null))
    );
  };

  const isStalemate = () => {
    for (let i = 0; i < 9; i++) if (!squares[i]) return false;
    return true;
  };

  return { move, findWin, isStalemate, getValue, clear, squares };
})();

const gamePlay = (() => {
  let xToMove = true;
  let player1, player2;

  const switchPlayer = () => (xToMove = !xToMove);

  const move = (e, i) => {
    const index = e ? e.target.dataset.index : i;
    const marker = xToMove ? 'X' : 'O';
    board.move(marker, index);
    updateStatus({ lastMove: index });
  };

  const updateStatus = (params) => {
    displayController.displayBoard();
    const winningLine = board.findWin();
    if (winningLine) {
      if (xToMove) {
        player1.addPoint();
        displayController.showResult('<h3>Player 1 Wins!</h3>');
      } else {
        player2.addPoint();
        displayController.showResult('<h3>Player 2 Wins!</h3>');
      }
      userPanels.showScores(player1, player2);
      displayController.disableAll();
      displayController.reset();
      displayController.displayWin(winningLine);
    } else if (board.isStalemate()) {
      displayController.showResult("<h3>It's a draw!<h3>");
    } else {
      switchPlayer();
      displayController.disable(params.lastMove);
    }
  };

  function newMatch(e) {
    e.preventDefault();
    const selection1 = this.querySelector('[name=player-one]').value;
    switch (selection1) {
      case 'Human':
        player1 = playerFactory('Player 1');
        break;
      case 'Computer (Easy)':
        player1 = computerEasy();
        break;
      case 'Computer (Medium)':
        player1 = computerMedium();
        break;
      default:
        player1 = computerHard();
    }
    const selection2 = this.querySelector('[name=player-two]').value;
    switch (selection2) {
      case 'Human':
        player2 = playerFactory('Player 2');
        break;
      case 'Computer (Easy)':
        player2 = computerEasy();
        break;
      case 'Computer (Medium)':
        player2 = computerMedium();
        break;
      default:
        player2 = computerHard();
    }
    newGame();
  }

  function newGame() {
    userPanels.restart();
    userPanels.showScores(player1, player2);
    userPanels.gameDisplay();
    displayController.enableAll();
    displayController.hideResult();
  }

  return { move, newMatch, newGame };
})();

const displayController = (() => {
  const squares = document.querySelectorAll('.square');
  const result = document.querySelector('.result');
  const resultText = result.querySelector('h3');
  const rematch = result.querySelector('.rematch');

  rematch.addEventListener('click', gamePlay.newGame);

  const displayBoard = () => {
    squares.forEach((square, i) => {
      const marker = board.getValue(i);
      square.innerHTML = marker ? `<img src='/images/${marker}.svg'>` : '';
    });
  };

  const displayWin = (winningLine) => {
    winningLine.forEach((index) =>
      squares[index].classList.add('winning-line')
    );
  };

  function showResult(message) {
    resultText.innerHTML = message;
    result.style.width = '90%';
    result.style.height = '90%';
    rematch.style.display = 'block';
  }

  const hideResult = () => {
    resultText.innerHTML = '';
    result.style.width = '0';
    result.style.height = '0';
    rematch.style.display = 'none';
  }

  const enableAll = () => {
    squares.forEach((square) => {
      square.addEventListener('click', gamePlay.move);
      square.classList.remove('unavailable');
    });
  };

  const disable = (index) => {
    lastMove = squares[index];
    lastMove.removeEventListener('click', gamePlay.move);
    lastMove.classList.add('unavailable');
  };

  const disableAll = () => {
    squares.forEach((square) => {
      square.removeEventListener('click', gamePlay.move);
      square.classList.add('unavailable');
    });
  };

  const reset = () => {
    squares.forEach((square) => square.classList.remove('winning-line'));
  }

  return { enableAll, disable, disableAll, displayBoard, displayWin, showResult, hideResult, reset };
})();

const playerFactory = (name) => {
  let points = 0;
  const getPoints = () => points;
  const addPoint = () => points++;

  return { name, getPoints, addPoint };
}

const computerEasy = () => {
  const prototype = playerFactory('Computer (Easy)');

  const move = () => {
    do {
      var i = Math.floor(Math.random() * 9)

    } while (board.getValue(i))
    gamePlay.move(null, i)
  }

  return Object.assign({}, prototype, {move})
}

const computerMedium = () => {
  const prototype = playerFactory('Computer (Medium)');

  const move = () => {
    do {
      var i = Math.floor(Math.random() * 9)

    } while (board.getValue(i))
    gamePlay.move(null, i)
  }

  return Object.assign({}, prototype, {move})
}

const computerHard = () => {
  const prototype = playerFactory('Computer (Hard)');

  const move = () => {
    do {
      var i = Math.floor(Math.random() * 9)

    } while (board.getValue(i))
    gamePlay.move(null, i)
  }

  return Object.assign({}, prototype, {move})
}

const userPanels = (() => {
  const gamePanel = document.querySelector('.game-panel');
  const restartButton = document.querySelector('.restart');
  const newMatchButton = document.querySelector('.new-match');

  restartButton.addEventListener('click', restart);
  newMatchButton.addEventListener('click', newMatch);

  const setupForm = document.querySelector('.setup-panel');
  setupForm.addEventListener('submit', gamePlay.newMatch);

  function reset() {
    displayController.reset();
    board.clear();
    displayController.displayBoard();
  }

  function restart() {
    reset();
    displayController.enableAll();
    displayController.hideResult();
  }

  function newMatch() {
    reset();
    setupForm.classList.remove('hidden');
    gamePanel.classList.add('hidden');
    displayController.disableAll();
    displayController.reset();
  }

  function showScores(player1, player2) {
    const p1 = document.querySelector('.player1-score');
    const p2 = document.querySelector('.player2-score');
    p1.textContent = `${player1.name}: ${player1.getPoints()}`
    p2.textContent = `${player2.name}: ${player2.getPoints()}`
  }

  function gameDisplay() {
    setupForm.classList.add('hidden');
    gamePanel.classList.remove('hidden');
  }

  return { showScores, gameDisplay, restart }

})();