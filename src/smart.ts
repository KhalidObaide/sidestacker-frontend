import GameRules from "./gameRules";
import { Direction, CellState, Player, GameStatus } from "./structures";

const DEPTH = 4;

class Smart {
  static getValidMoves(
    board: CellState[][]
  ): { direction: Direction; row: number }[] {
    const moves = new Set(
      [Direction.Left, Direction.Right]
        .map((direction) => {
          const validSpots: string[] = [];
          for (let i = 0; i < 6; i++) {
            const column =
              direction === Direction.Left
                ? board[i].findIndex((cell) => cell === CellState.Empty)
                : board[i].lastIndexOf(CellState.Empty);
            if (column !== -1) {
              validSpots.push(direction.toString() + i.toString());
            }
          }
          return validSpots;
        })
        .flat()
    );
    return Array.from(moves).map((move) => {
      const dir = move.slice(0, 1);
      const row = move.slice(1);
      return { direction: dir as Direction, row: parseInt(row) };
    });
  }

  static makeMove(
    board: CellState[][],
    move: { direction: Direction; row: number },
    turn: Player
  ): CellState[][] {
    const newBoard = board.map((row) => row.slice());
    const column =
      move.direction === Direction.Left
        ? newBoard[move.row].findIndex((cell) => cell === CellState.Empty)
        : newBoard[move.row].lastIndexOf(CellState.Empty);
    newBoard[move.row][column] =
      turn === Player.Player1 ? CellState.Player1 : CellState.Player2;
    return newBoard;
  }

  static minimax(
    board: CellState[][],
    depth: number,
    isMaximizing: boolean
  ): number {
    const gameStatus = GameRules.getGameStatus(board);
    if (gameStatus === GameStatus.Player1Won) {
      return 10;
    } else if (gameStatus === GameStatus.Player2Won) {
      return -10;
    } else if (gameStatus === GameStatus.Draw) {
      return 0;
    }
    if (depth === 0) {
      return 0;
    }
    const allMoves = Smart.getValidMoves(board);
    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of allMoves) {
        const newBoard = Smart.makeMove(board, move, Player.Player1);
        const score = Smart.minimax(newBoard, depth - 1, false);
        bestScore = Math.max(score, bestScore);
      }
      return bestScore;
    }
    let bestScore = Infinity;
    for (const move of allMoves) {
      const newBoard = Smart.makeMove(board, move, Player.Player2);
      const score = Smart.minimax(newBoard, depth - 1, true);
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }

  static findMove(board: CellState[][]) {
    const allMoves = Smart.getValidMoves(board);
    let bestScore = -Infinity;
    let bestMove = allMoves[0];
    for (const move of allMoves) {
      const newBoard = Smart.makeMove(board, move, Player.Player1);
      const score = Smart.minimax(newBoard, DEPTH, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }
}

export default Smart;
