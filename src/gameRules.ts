import { CellState, GameStatus } from "./structures";

class GameRules {
  static getGameStatus(board: CellState[][]): GameStatus {
    let player1Count = 0;
    let player2Count = 0;
    let winner: CellState = CellState.Empty;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] !== CellState.Empty) {
          // check horizontal
          if (j + 3 < board[i].length) {
            if (
              board[i][j] === board[i][j + 1] &&
              board[i][j] === board[i][j + 2] &&
              board[i][j] === board[i][j + 3]
            ) {
              winner = board[i][j];
              break;
            }
          }

          // check vertical
          if (i + 3 < board.length) {
            if (
              board[i][j] === board[i + 1][j] &&
              board[i][j] === board[i + 2][j] &&
              board[i][j] === board[i + 3][j]
            ) {
              winner = board[i][j];
              break;
            }
          }

          // check diagonal
          if (i + 3 < board.length && j + 3 < board[i].length) {
            if (
              board[i][j] === board[i + 1][j + 1] &&
              board[i][j] === board[i + 2][j + 2] &&
              board[i][j] === board[i + 3][j + 3]
            ) {
              winner = board[i][j];
              break;
            }
          }

          // check anti-diagonal
          if (i + 3 < board.length && j - 3 >= 0) {
            if (
              board[i][j] === board[i + 1][j - 1] &&
              board[i][j] === board[i + 2][j - 2] &&
              board[i][j] === board[i + 3][j - 3]
            ) {
              winner = board[i][j];
              break;
            }
          }
        }

        if (board[i][j] === CellState.Player1) player1Count++;
        else if (board[i][j] === CellState.Player2) player2Count++;
      }
    }
    if (winner === CellState.Empty) {
      // check for a tie
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] === CellState.Empty) {
            if (player1Count > player2Count) return GameStatus.Player2Turn;
            else return GameStatus.Player1Turn;
          }
        }
      }
      return GameStatus.Draw;
    }
    return winner === CellState.Player1
      ? GameStatus.Player1Won
      : GameStatus.Player2Won;
  }
}

export default GameRules;
