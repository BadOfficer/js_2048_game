'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

const initialStateMatrix = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

class Game {
  static STATUS_IDLE = 'idle';
  static STATUS_PLAYING = 'playing';
  static STATUS_WIN = 'win';
  static STATUS_LOSE = 'lose';
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState = initialStateMatrix) {
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.STATUS_IDLE;
    this.isFirstMove = true;
  }

  moveLeft() {
    const prevState = JSON.stringify(this.state);

    for (const row of this.state) {
      this.#baseMove(row);
    }

    if (this.#compareState(prevState)) {
      this.#fillRandomCell();
    }

    if (!this.#canMove()) {
      this.status = Game.STATUS_LOSE;
    }

    this.#changeFirstMoveStatus();
  }
  moveRight() {
    const prevState = JSON.stringify(this.state);

    for (const row of this.state) {
      this.#reverseRow(row);
      this.#baseMove(row);
      this.#reverseRow(row);
    }

    if (this.#compareState(prevState)) {
      this.#fillRandomCell();
    }

    if (!this.#canMove()) {
      this.status = Game.STATUS_LOSE;
    }

    this.#changeFirstMoveStatus();
  }
  moveUp() {
    const prevState = JSON.stringify(this.state);

    this.#transposeMatrix(this.state);

    for (const row of this.state) {
      this.#baseMove(row);
    }
    this.#transposeMatrix(this.state);

    if (this.#compareState(prevState)) {
      this.#fillRandomCell();
    }

    if (!this.#canMove()) {
      this.status = Game.STATUS_LOSE;
    }

    this.#changeFirstMoveStatus();
  }
  moveDown() {
    const prevState = JSON.stringify(this.state);

    this.#transposeMatrix(this.state);

    for (const row of this.state) {
      this.#reverseRow(row);
      this.#baseMove(row);
      this.#reverseRow(row);
    }
    this.#transposeMatrix(this.state);

    if (this.#compareState(prevState)) {
      this.#fillRandomCell();
    }

    if (!this.#canMove()) {
      this.status = Game.STATUS_LOSE;
    }

    this.#changeFirstMoveStatus();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = Game.STATUS_PLAYING;

    for (let i = 1; i <= 2; i++) {
      const initialRowIndex = this.#getRandomIndex();
      const initialColumnIndex = this.#getRandomIndex();

      this.state[initialRowIndex][initialColumnIndex] =
        this.#getRandomCellValue();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = Game.STATUS_IDLE;
    this.score = 0;
    this.state = initialStateMatrix.map((row) => [...row]);
  }

  #getRandomIndex(initialMin = 0, initialMax = 4) {
    const min = Math.ceil(initialMin);
    const max = Math.floor(initialMax);

    return Math.floor(Math.random() * (max - min)) + min;
  }

  #compress(row) {
    const newRow = row.filter((item) => item !== 0);

    for (let i = 0; i < row.length; i++) {
      row[i] = newRow[i] || 0;
    }
  }

  #merge(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] += row[i + 1];
        row[i + 1] = 0;
        this.score += row[i];

        if (row[i] === 2048) {
          this.status = Game.STATUS_WIN;
        }
      }
    }
  }

  #reverseRow(row) {
    row.reverse();
  }

  #transposeMatrix(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = i + 1; j < matrix[i].length; j++) {
        [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
      }
    }
  }

  #getRandomCellValue() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  #fillRandomCell() {
    let newRandomRowIndex = this.#getRandomIndex();
    let newRandomColIndex = this.#getRandomIndex();

    while (this.state[newRandomRowIndex][newRandomColIndex] !== 0) {
      newRandomRowIndex = this.#getRandomIndex();
      newRandomColIndex = this.#getRandomIndex();
    }

    this.state[newRandomRowIndex][newRandomColIndex] =
      this.#getRandomCellValue();
  }

  #canMove() {
    const size = this.state.length;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (this.state[i][j] === 0) {
          return true;
        }

        if (j < size - 1 && this.state[i][j] === this.state[i][j + 1]) {
          return true;
        }

        if (j < size - 1 && this.state[j][i] === this.state[j + 1][i]) {
          return true;
        }
      }
    }

    return false;
  }

  #baseMove(row) {
    this.#compress(row);
    this.#merge(row);
    this.#compress(row);
  }

  #compareState(prevState) {
    const newState = JSON.stringify(this.state);

    return prevState !== newState;
  }

  #changeFirstMoveStatus() {
    if (this.isFirstMove) {
      this.start();
      this.status = Game.STATUS_PLAYING;
      this.isFirstMove = false;
    }
  }
}

module.exports = Game;
