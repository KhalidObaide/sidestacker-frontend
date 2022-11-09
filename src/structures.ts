export interface CellPosition {
    row: number;
    column: number;
}

export enum Direction {
    Right='R',
    Left='L'
}

export enum ErrorCase {
    InvalidRow,
    SpotTaken,
}

export enum Player {
    Player1=1,
    Player2=2
}

export enum CellState {
    Empty=0,
    Player1=1,
    Player2=2
}

export enum CellType {
    InsertLeft='left',
    InsertRight='right',
    Cell='generic'
}
