import React from "react";
import { CellState, CellType } from "../structures";

interface CellProps {
  cellType: CellType;
  state: CellState;
}

function Cell(cellProps: CellProps) {
  const { cellType, state } = cellProps;

  return (
    <React.Fragment>
      {cellType === CellType.Cell && (
        <div className="cell">
          <div className={"cell-circle player" + state}></div>
        </div>
      )}
      {(cellType === CellType.InsertLeft ||
        cellType === CellType.InsertRight) && (
        <div className={"cell insert " + cellType}></div>
      )}
    </React.Fragment>
  );
}

export default Cell;
