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

  const move = (marker, position) => {
    squares[position] ||= marker;
  };

  const undoMove = (position) => delete squares[position];

  const getValue = (index) => squares[index];

  const clear = () => (squares = []);

  const findWin = () => lines.find((line) => line
    .map((index) => squares[index])
    .reduce((acc, cur) => (acc === cur ? acc : null)));

  const isStalemate = () => Object.keys(squares).length === 9;

  return {
    move,
    undoMove,
    getValue,
    findWin,
    isStalemate,
    clear,
  };
})();

const gamePlay = (() => {
  let xIsFirst = true;
  let xToMove = true;
  let player1;
  let player2;

  const evaluateWin = () => (xToMove ? 1 : -1);

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
      const winningPlayer = xToMove ? player1 : player2;
      winningPlayer.addPoint(1);
      displayController.showResult(`${winningPlayer.name} Wins!`);
      displayController.disableAll();
      displayController.displayWin(winningLine);
    } else if (board.isStalemate()) {
      player1.addPoint(0.5);
      player2.addPoint(0.5);
      displayController.showResult("It's a draw!");
    } else {
      displayController.disable(params.lastMove);
      xToMove = !xToMove;
      checkForComputerMove();
      return;
    }
    userPanels.showScores(player1, player2);
    xIsFirst = !xIsFirst;
  };

  const checkForComputerMove = () => {
    const currentPlayer = xToMove ? player1 : player2;
    if (Object.prototype.hasOwnProperty.call(currentPlayer, 'move')) {
      displayController.disableAll();
      userPanels.disableGameButtons();
      setTimeout(() => currentPlayer.move(), 700);
    } else {
      displayController.reenable();
      userPanels.enableGameButtons();
    }
  };

  const newGame = () => {
    userPanels.showScores(player1, player2);
    userPanels.showGamePanel();
    displayController.resetBoard();
    xToMove = xIsFirst;
    checkForComputerMove();
  };

  function newMatch(e) {
    e.preventDefault();
    switch (this.querySelector('[name=player-one]').value) {
      case 'Human':
        player1 = playerFactory('Player 1');
        break;
      case 'Computer (Easy)':
        player1 = computerEasy();
        break;
      case 'Computer (Medium)':
        player1 = computerMedium(true);
        break;
      default:
        player1 = computerHard(true);
    }
    switch (this.querySelector('[name=player-two]').value) {
      case 'Human':
        player2 = playerFactory('Player 2');
        break;
      case 'Computer (Easy)':
        player2 = computerEasy();
        break;
      case 'Computer (Medium)':
        player2 = computerMedium(false);
        break;
      default:
        player2 = computerHard(false);
    }
    xIsFirst = true;
    newGame();
  }

  return {
    move,
    newMatch,
    newGame,
    evaluateWin,
  };
})();

const displayController = (() => {
  const squares = document.querySelectorAll('.square');
  const result = document.querySelector('.result');
  const resultText = result.querySelector('h3');
  const rematch = result.querySelector('.rematch');

  rematch.addEventListener('click', gamePlay.newGame);
  squares.forEach((square) => square.addEventListener('click', gamePlay.move));

  const displayBoard = () => {
    squares.forEach((square, i) => {
      const marker = board.getValue(i);
      if (marker) {
        square.innerHTML = `<img src='/images/${marker}.svg'>`;
        setTimeout(() => square.classList.add('img-visible'), 5);
      }
    });
  };

  const displayWin = (winningLine) => {
    winningLine.forEach((index) => squares[index].classList.add('winning-line'));
  };

  const showResult = (message) => {
    setTimeout(() => {
      result.style.width = '100%';
      result.style.height = '100%';
      setTimeout(() => {
        resultText.innerHTML = `<h3>${message}</h3>`;
        rematch.style.display = 'block';
      }, 200);
    }, 500);
    setTimeout(() => userPanels.enableGameButtons(), 1000);
  };

  const hideResult = () => {
    resultText.innerHTML = '';
    result.style.width = '0';
    result.style.height = '0';
    rematch.style.display = 'none';
  };

  const reenable = () => {
    squares.forEach((square, i) => {
      if (!board.getValue(i)) square.classList.remove('unavailable');
    });
  };

  const disable = (index) => squares[index].classList.add('unavailable');

  const disableAll = () => {
    squares.forEach((square) => square.classList.add('unavailable'));
  };

  const resetBoard = () => {
    squares.forEach((square) => {
      square.classList.remove('img-visible');
      square.classList.remove('winning-line');
    });
    hideResult();
    board.clear();
    displayBoard();
  };

  return {
    reenable,
    disable,
    disableAll,
    displayBoard,
    displayWin,
    showResult,
    resetBoard,
  };
})();

const userPanels = (() => {
  const setupForm = document.querySelector('.setup-panel');
  const gamePanel = document.querySelector('.game-panel');
  const restartButton = document.querySelector('.restart');
  const newMatchButton = document.querySelector('.new-match');

  const player1score = document.querySelector('.player1-score');
  const player2score = document.querySelector('.player2-score');

  const enableGameButtons = () => {
    restartButton.classList.remove('unavailable');
    newMatchButton.classList.remove('unavailable');
  };

  const disableGameButtons = () => {
    restartButton.classList.add('unavailable');
    newMatchButton.classList.add('unavailable');
  };

  const newMatch = () => {
    displayController.resetBoard();
    displayController.disableAll();
    showSetupPanel();
  };

  const showScores = (player1, player2) => {
    player1score.textContent = `${player1.name}: ${player1.getPoints()}`;
    player2score.textContent = `${player2.name}: ${player2.getPoints()}`;
  };

  const showGamePanel = () => {
    setupForm.classList.add('hidden');
    gamePanel.classList.remove('hidden');
  };

  const showSetupPanel = () => {
    gamePanel.classList.add('hidden');
    setupForm.classList.remove('hidden');
  };

  setupForm.addEventListener('submit', gamePlay.newMatch);
  newMatchButton.addEventListener('click', newMatch);
  restartButton.addEventListener('click', gamePlay.newGame);

  return {
    showScores, showGamePanel, enableGameButtons, disableGameButtons,
  };
})();

const playerFactory = (name) => {
  const allowedIncrements = [0.5, 1];
  let points = 0;
  const getPoints = () => points;
  const addPoint = (value) => {
    if (allowedIncrements.includes(value)) points += value;
  };

  return { name, getPoints, addPoint };
};

const computerFactory = (name) => {
  const prototype = playerFactory(name);

  const findAvailableMoves = () => {
    const available = [];
    for (let i = 0; i < 9; i++) {
      if (!board.getValue(i)) available.push(i);
    }
    return available;
  };

  function minimax(maximizingPlayer, depth = 99) {
    // evaluation is from caller's perspective (!maximizingPlayer)
    const evaluation = evaluate(!maximizingPlayer);
    if (evaluation !== false) return { value: evaluation };
    if (depth === 0) {
      // evaluate position at depth's limit to better than a loss but worse than a draw
      const value = maximizingPlayer ? 0.5 : -0.5;
      return { value };
    }

    const availableMoves = findAvailableMoves();
    let currentBestValue;
    let bestMoves = [];
    if (maximizingPlayer) {
      currentBestValue = -99;
      for (let i = 0; i < availableMoves.length; i++) {
        const index = availableMoves[i];
        board.move('X', index);
        const leafValue = minimax(false, depth - 1).value;
        if (leafValue > currentBestValue) {
          currentBestValue = leafValue;
          bestMoves = [index];
        } else if (leafValue === currentBestValue) {
          bestMoves.push(index);
        }
        board.undoMove(index);
      }
    } else {
      currentBestValue = 99;
      for (let i = 0; i < availableMoves.length; i++) {
        const index = availableMoves[i];
        board.move('O', index);
        const leafValue = minimax(true, depth - 1).value;
        if (leafValue < currentBestValue) {
          currentBestValue = leafValue;
          bestMoves = [index];
        } else if (leafValue === currentBestValue) {
          bestMoves.push(index);
        }
        board.undoMove(index);
      }
    }
    return { value: currentBestValue, bestMoves };
  }

  const evaluate = (xLastMove) => {
    if (board.findWin()) return xLastMove ? 1 : -1;
    if (board.isStalemate()) return 0;
    return false;
  };

  return { ...prototype, findAvailableMoves, minimax };
};

const computerEasy = () => {
  const {
    name, getPoints, addPoint, findAvailableMoves,
  } = computerFactory('Computer (Easy)');

  const move = () => {
    const available = findAvailableMoves();
    const i = Math.floor(Math.random() * available.length);
    gamePlay.move(null, available[i]);
  };

  return {
    name, getPoints, addPoint, move,
  };
};

const computerMedium = (isPlayer1) => {
  const {
    name, getPoints, addPoint, minimax,
  } = computerFactory('Computer (Medium)');

  const move = () => {
    const moves = minimax(isPlayer1, 3).bestMoves;
    const i = Math.floor(Math.random() * moves.length);
    gamePlay.move(null, moves[i]);
  };

  return {
    name, getPoints, addPoint, move,
  };
};

const computerHard = (isPlayer1) => {
  const {
    name, getPoints, addPoint, minimax,
  } = computerFactory('Computer (Hard)');

  const move = () => {
    const moves = minimax(isPlayer1).bestMoves;
    const i = Math.floor(Math.random() * moves.length);
    gamePlay.move(null, moves[i]);
  };

  return {
    name, getPoints, addPoint, move,
  };
};
