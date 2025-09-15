'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startBtn = document.querySelector('.button');
const score = document.querySelector('.game-score');
const boardRows = document.querySelector('.game-field').tBodies[0].rows;

startBtn.addEventListener('click', () => {
  if (game.getStatus() === Game.STATUS_IDLE) {
    game.start();
  } else {
    game.restart();
  }

  updateBtnState();
  updateMessageState();
  updateScore();
  updateCells();
});

function updateBtnState() {
  startBtn.className = 'button';

  if (game.getStatus() === Game.STATUS_IDLE) {
    startBtn.classList.add('start');
    startBtn.textContent = 'Start';
  } else {
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
  }
}

function updateMessageState() {
  const messages = [...document.querySelectorAll('.message')];

  messages.forEach((mes) => {
    mes.classList.add('hidden');
  });

  switch (game.getStatus()) {
    case Game.STATUS_IDLE:
      messages
        .find((mes) => mes.classList.contains('message-start'))
        .classList.remove('hidden');
      break;

    case Game.STATUS_LOSE:
      messages
        .find((mes) => mes.classList.contains('message-lose'))
        .classList.remove('hidden');
      break;

    case Game.STATUS_WIN:
      messages
        .find((mes) => mes.classList.contains('message-win'))
        .classList.remove('hidden');
      break;
  }
}

function updateScore() {
  score.textContent = game.getScore();
}

function updateCells() {
  for (let i = 0; i < boardRows.length; i++) {
    for (let j = 0; j < boardRows[i].cells.length; j++) {
      boardRows[i].cells[j].textContent = game.getState()[i][j] || '';
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (
    game.getStatus !== Game.STATUS_WIN ||
    game.getStatus() !== Game.STATUS_LOSE
  ) {
    if (e.key === 'ArrowLeft') {
      game.moveLeft();
    }

    if (e.key === 'ArrowRight') {
      game.moveRight();
    }

    if (e.key === 'ArrowUp') {
      game.moveUp();
    }

    if (e.key === 'ArrowDown') {
      game.moveDown();
    }

    updateBtnState();
    updateCells();
    updateScore();
    updateMessageState();
  }
});

// Write your code here
