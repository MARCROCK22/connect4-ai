//"FORKED" FROM https://github.com/DaveTrost/connect4-ai WITH SOME EDITS

const difficultyRatios = {
  hard: {
    tier1Ratio: 1,
    tier2Ratio: 0,
    tier3Ratio: 0,
  },
  medium: {
    tier1Ratio: 0.5,
    tier2Ratio: 0.5,
    tier3Ratio: 0,
  },
  easy: {
    tier1Ratio: 0.2,
    tier2Ratio: 0.3,
    tier3Ratio: 0.5,
  },
};

const SW_BY_NE = "southwestByNortheast";
const NW_BY_SE = "northwestBySoutheast";
const WEST_BY_EAST = "westByEast";
const SOUTH = "south";

/**
 * This class for storing a Connect 4 board is based on an outline from Pascal Pons at:
 * http://blog.gamesolver.org/
 */
class Connect4 {
  constructor(w = 7, h = 6) {
    this.width = w;
    this.height = h;
    this.playerMarks = [2, 1];
    this.reset();
  }

  /* Return all game state values to their initial conditions and start a new game */
  reset() {
    this.board = {};
    for (let c = 0; c < this.width; c++) {
      this.board[c] = [];
    }
    this.moveCount = 0;
    this.plays = "";
    this.gameOver = false;
    this.winner = null;
    this.solution = null;
  }

  /*  Indicates whether a (zero-based index) column is playable. */
  canPlay(col) {
    if (!this.board[col]) return false;
    return this.board[col].length < this.height;
  }

  /* Plays a playable column */
  play(col) {
    if (this.gameOver) return;
    if (!this.canPlay(col))
      throw `Exception: ${col} is not a valid play. Please use canPlay(column) before submitting a move`;

    const solutionDirection = this.isWinningMove(col);
    if (solutionDirection) {
      this.gameOver = true;
      this.winner = this.getActivePlayer();
    }

    this.moveCount++;
    this.plays += this.plays.length ? ` ${col}` : `${col}`;
    this.board[col].push(this.playerMarks[this.moveCount % 2]);

    if (solutionDirection) {
      this.setSolution(col, solutionDirection);
    }

    if (this.moveCount >= this.height * this.width) this.gameOver = true;
  }
  /* Play using a 1-based indexing system */
  play1BasedColumn(col) {
    return this.play(col - 1);
  }
  /* Play a series of moves */
  playMoves(plays) {
    plays.forEach((play) => this.play(play));
  }

  /* Returns a string representing the direction of the winning sequence if playing into the given column results in a win.
    The function returns an empty string when the move is not a winning move */
  isWinningMove(col) {
    const markToBePlayed = `${this.playerMarks[(this.moveCount + 1) % 2]}`;
    const winPreReq = markToBePlayed.repeat(3);

    if (this.southwestBy3NortheastBy3(col).includes(winPreReq)) return SW_BY_NE;
    if (this.northwestBy3SoutheastBy3(col).includes(winPreReq)) return NW_BY_SE;
    if (this.westBy3EastBy3(col).includes(winPreReq)) return WEST_BY_EAST;
    if (this.southBy3(col).includes(winPreReq)) return SOUTH;
    return "";
  }
  southBy3(col) {
    return this.board[col].join("").slice(-3);
  }
  westBy3EastBy3(col, rowMovementWestToEast = 0) {
    const row = this.board[col].length;
    return Object.values(this.board).reduce((marks, colArr, colIndex) => {
      const colDelta = colIndex - col;
      if (Math.abs(colDelta) > 3 || colDelta === 0) return marks;

      const mark = colArr[row + rowMovementWestToEast * colDelta] || "_";
      return marks + mark;
    }, "");
  }
  southwestBy3NortheastBy3(col) {
    return this.westBy3EastBy3(col, +1);
  }
  northwestBy3SoutheastBy3(col) {
    return this.westBy3EastBy3(col, -1);
  }

  setSolution(col, dir) {
    let column = col;
    let spacesFromBottom = this.board[col].length - 1;
    let gotoNeighbor1 = () => null;
    let gotoNeighbor2 = () => null;

    this.solution = [{ column, spacesFromBottom }];
    const mark = this.board[column][spacesFromBottom];

    const makeNeighborFunction = (dx, dy) => () => {
      column += dx;
      spacesFromBottom += dy;
    };

    if (dir === SOUTH) gotoNeighbor1 = makeNeighborFunction(0, -1);
    if (dir === SW_BY_NE) gotoNeighbor1 = makeNeighborFunction(-1, -1);
    if (dir === NW_BY_SE) gotoNeighbor1 = makeNeighborFunction(-1, +1);
    if (dir === WEST_BY_EAST) gotoNeighbor1 = makeNeighborFunction(-1, 0);

    for (let i = 0; i < 3; i++) {
      gotoNeighbor1();
      if (this.board[column] && this.board[column][spacesFromBottom] === mark) {
        this.solution.push({ column, spacesFromBottom });
      }
    }

    if (dir === SOUTH) return;
    if (dir === SW_BY_NE) gotoNeighbor2 = makeNeighborFunction(+1, +1);
    if (dir === NW_BY_SE) gotoNeighbor2 = makeNeighborFunction(+1, -1);
    if (dir === WEST_BY_EAST) gotoNeighbor2 = makeNeighborFunction(+1, 0);

    column = col;
    spacesFromBottom = this.board[col].length - 1;

    for (let i = 0; i < 3; i++) {
      gotoNeighbor2();
      if (this.board[column] && this.board[column][spacesFromBottom] === mark) {
        this.solution.push({ column, spacesFromBottom });
      }
    }
  }

  /* returns the number of moves made so far in the game */
  getMoveCount() {
    return this.moveCount;
  }
  /* returns a string of the moves made so far in the game */
  getPlays() {
    return this.plays;
  }
  /* returns 1 or 2 (an integer) to represent which player is next to play  */
  getActivePlayer() {
    return this.playerMarks[(this.moveCount + 1) % 2];
  }
  /* returns an object containing game information */
  gameStatus() {
    const status = {
      movesPlayed: this.getMoveCount(),
      currentPlayer: this.getActivePlayer(),
      gameOver: this.gameOver,
    };
    if (this.gameOver) {
      status.winner = this.winner;
      status.solution = this.solution;
    }
    return status;
  }

  /* returns an ASCII string representing the current state of the board */
  ascii() {
    const asciiBoard = Object.values(this.board).map((col) =>
      col.map((mark) => ` ${mark} `)
    );
    asciiBoard.forEach((col) => {
      while (col.length < this.height) col.push(" - ");
    });

    let ascii = "\n";
    for (let row = this.height - 1; row >= 0; row--) {
      for (let col = 0; col < this.width; col++) {
        ascii += asciiBoard[col][row];
      }
      ascii += "\n";
    }
    ascii += "---".repeat(this.width) + "\n";
    for (let col = 0; col < this.width; col++) {
      ascii += `[${col}]`;
    }

    return ascii;
  }
}

class Connect4AI extends Connect4 {
  constructor(w = 7, h = 6) {
    super(w, h);
    this.recursiveDepthLimit = 3;
  }

  playAI(difficulty = "medium") {
    const scores = this.negamaxScores();
    const top3ScoreTiers = getTop3ScoreTiers(scores);
    const targetScore = getTargetScore(difficulty, top3ScoreTiers);
    const plays = getTargetPlays(scores, targetScore);
    const aiPlay = getRandomEle(plays);
    this.play(aiPlay);
    return aiPlay;
  }

  /*
   * This method recursively solves a connect 4 position using the negamax variant of min-max algorithm.
   * Based on a string of the prior game plays, it returns an array with the "score" for playing each column.
   *   Scoring follows this convention:
   *    - 0 for a draw game or an unknown outcome
   *    - Positive score if the move can win despite the opponent's responses.
   *    - Negative score if the opponent can force a loss.
   *    - The faster the win/loss can occur, the larger the absolute value of the score
   *    - The magnitude of +/- scores is determined by: the number of spaces remaining on the board after the win/loss.
   * The optional maxDepth parameter can adjust AI accuracy
   *  - The default is set to 3 levels of recursion - currently for performance reasons
   *  - Larger values can be specidied with the tradeoff of longer execution time
   */
  negamaxScores(maxDepth) {
    if (!maxDepth) maxDepth = this.recursiveDepthLimit;

    const bestScores = Array.from({ length: this.width }, (_, col) => {
      if (!this.canPlay(col)) return null;

      const board = this.recreateBoard(this.getPlays());
      return this.negamax(board, col, maxDepth);
    });

    return bestScores;
  }

  negamax(game, nextPlay, maxDepth, currentDepth = 0) {
    if (currentDepth > maxDepth) return 0;
    if (!game.canPlay(nextPlay)) return 0;

    game.play(nextPlay);
    if (game.gameOver) {
      return game.width * game.height - game.moveCount;
    }

    let bestScore = null;
    const resetString = game.getPlays();
    for (let c = 0; c < game.width; c++) {
      const newBoard = this.recreateBoard(resetString);
      const testScore = this.negamax(newBoard, c, maxDepth, currentDepth + 1);
      bestScore = getMax(bestScore, testScore);
    }
    return 0 - bestScore;
  }

  recreateBoard(gamePlays) {
    const newBoard = new Connect4();
    if (gamePlays) {
      newBoard.playMoves(gamePlays.split(" "));
    }
    return newBoard;
  }
}

function getTop3ScoreTiers(scores) {
  const topScores = scores
    .filter((x) => x !== null)
    .sort((scoreA, scoreB) => scoreB - scoreA)
    .reduce((uniqueScores, score) => {
      if (uniqueScores.includes(score)) return uniqueScores;
      return [...uniqueScores, score];
    }, []);
  topScores.unshift(topScores[0], topScores[0]);
  return topScores.splice(-3, 3);
}

function getTargetScore(difficulty, top3ScoreTiers) {
  const { tier1Ratio, tier3Ratio } = difficultyRatios[difficulty.toLowerCase()];

  const [tier1Score, tier2Score, tier3Score] = top3ScoreTiers;
  const [tier1Floor, tier2Floor, tier3Floor] = [1 - tier1Ratio, tier3Ratio, 0];

  const ratio = Math.random();
  if (ratio >= tier1Floor) return tier1Score;
  if (ratio < tier1Floor && ratio >= tier2Floor) return tier2Score;
  if (ratio < tier2Floor && ratio >= tier3Floor) return tier3Score;
}

function getTargetPlays(scores, targetScore) {
  return scores.reduce((plays, score, i) => {
    if (score === targetScore) plays.push(i);
    return plays;
  }, []);
}

function getMax(val1, val2) {
  if (val1 === null) return val2;
  return Math.max(val1, val2);
}

function getRandomEle(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = { Connect4AI };
