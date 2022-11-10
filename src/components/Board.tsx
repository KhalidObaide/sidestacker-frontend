import React from "react";
import { forwardRef, useImperativeHandle } from "react";
import Cell from "./Cell";
import {
  CellPosition,
  CellState,
  CellType,
  Player,
  Direction,
  ErrorCase,
  Game,
  GameStatus,
  ReadyStatuses,
} from "../structures";

interface BoardProps {
  rows: number;
  columns: number;
  game: Game;
  onMove: (row: number, direction: Direction) => void;
}

const Board = forwardRef((props: BoardProps, ref) => {
  const { rows, columns, game, onMove } = props;

  // initial setup
  const setupBoard = () => {
    const board: CellState[][] = [];
    for (let i = 0; i < rows; i++) {
      board.push([]);
      for (let j = 0; j < columns; j++) board[i].push(CellState.Empty);
    }
    return board;
  };
  const [masterBoard, setMasterBoard] = React.useState<CellState[][]>(
    setupBoard()
  );

  // helper functions
  const resetMasterBoard = () => setMasterBoard(setupBoard());
  useImperativeHandle(ref, () => ({ resetMasterBoard }));
  const findSpot = (
    board: CellState[][],
    row: number,
    direction: Direction
  ): CellPosition | ErrorCase => {
    if (row < 0 || row >= board.length) return ErrorCase.InvalidRow;
    const column =
      direction === Direction.Left
        ? board[row].findIndex((cell) => cell === CellState.Empty)
        : board[row].lastIndexOf(CellState.Empty);
    if (column === -1) return ErrorCase.SpotTaken;
    return { row, column };
  };
  const makeMove = (
    board: number[][],
    row: number,
    direction: Direction,
    player: Player
  ) => {
    if ([...ReadyStatuses, GameStatus.Waiting].includes(game.status)) return;
    if (
      game.player === Player.Player1 &&
      game.status !== GameStatus.Player1Turn
    )
      return;
    if (
      game.player === Player.Player2 &&
      game.status !== GameStatus.Player2Turn
    )
      return;
    const spot = findSpot(board, row, direction);
    if (spot === ErrorCase.SpotTaken || spot === ErrorCase.InvalidRow) return;
    onMove(row, direction);
  };
  const runMoves = (input: string) => {
    const moves = input
      .split("/")
      .slice(0, -1)
      .map((move) => {
        const direction: Direction = move[0] as Direction;
        const row: number = parseInt(move[1]);
        return { direction, row };
      });
    const board = setupBoard();
    let player = Player.Player1;
    moves.forEach((move) => {
      const spot = findSpot(board, move.row, move.direction);
      if (spot === ErrorCase.SpotTaken || spot === ErrorCase.InvalidRow) return;
      board[spot.row][spot.column] = parseInt(player.toString());
      player = player === Player.Player1 ? Player.Player2 : Player.Player1;
    });
    setMasterBoard(board);
  };

  React.useEffect(() => {
    if (game.moves !== "") runMoves(game.moves);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.moves]);

  return (
    <div
      className={
        "board " +
        ([...ReadyStatuses, GameStatus.Waiting].includes(game.status)
          ? "disabled"
          : "")
      }
    >
      {masterBoard.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          <div
            onClick={() =>
              makeMove(masterBoard, rowIndex, Direction.Left, game.player)
            }
          >
            <Cell cellType={CellType.InsertRight} state={CellState.Empty} />
          </div>
          {row.map((column, columnIndex) => (
            <Cell cellType={CellType.Cell} state={column} key={columnIndex} />
          ))}
          <div
            onClick={() =>
              makeMove(masterBoard, rowIndex, Direction.Right, game.player)
            }
          >
            <Cell cellType={CellType.InsertLeft} state={CellState.Empty} />
          </div>
        </div>
      ))}
    </div>
  );
});

export default Board;
