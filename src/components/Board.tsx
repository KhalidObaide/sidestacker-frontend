import React from 'react';
import Cell from './Cell';
import {CellPosition, CellState, CellType, Player, Direction, ErrorCase} from '../structures';

interface BoardProps {
    rows: number;
    columns: number;
}
function Board(boardProps: BoardProps) {
  const { rows, columns } = boardProps;

  // initial setup
  const setupBoard = () => {
    const board: CellState[][] = [];
    for (let i = 0; i < rows; i++) {
      board.push([]);
      for (let j = 0; j < columns; j++) board[i].push(CellState.Empty);
    }
    return board;
  }
  const [masterBoard, setMasterBoard] = React.useState<CellState[][]>(setupBoard());
  const [player, setPlayer] = React.useState<Player>(Player.Player1);

  // helper functions
  const findSpot = (board: CellState[][], row: number, direction: Direction): CellPosition | ErrorCase => {
      if (row < 0 || row >= board.length) return ErrorCase.InvalidRow;
      const column = direction === Direction.Right
          ? board[row].findIndex(cell => cell === CellState.Empty)
          : board[row].lastIndexOf(CellState.Empty);
      if (column === -1) return ErrorCase.SpotTaken;
      return { row, column };
  }
  const makeMove = (board: number[][], row: number, direction: Direction) => {
      const spot = findSpot(board, row, direction);
      if ( spot === ErrorCase.SpotTaken || spot === ErrorCase.InvalidRow) return
      board[spot.row][spot.column] = player;
      setPlayer(player === Player.Player1 ? Player.Player2 : Player.Player1);
      setMasterBoard(board)
  }

  return (
    <div className="board">
        {masterBoard.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
                <div onClick={() => makeMove(masterBoard, rowIndex, Direction.Right)}>
                    <Cell cellType={CellType.InsertRight} state={CellState.Empty} />
                </div>
                {row.map((column, columnIndex) => (
                    <Cell cellType={CellType.Cell} state={column} key={columnIndex} />
                ))}
                <div onClick={() => makeMove(masterBoard, rowIndex, Direction.Left)}>
                    <Cell cellType={CellType.InsertLeft} state={CellState.Empty} />
                </div>
            </div>
        ))}
      </div>
  );
}

export default Board;
