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

export enum GameStatus {
    Disconnected=-1,
    Waiting=0,
    Player1Turn=1,
    Player2Turn=2,
    Player1Won=3,
    Player2Won=4,
    Draw=5,
    Cancelled=6
}

export interface Game {
    status: GameStatus;
    game_id: number,
    player: Player;
    moves: string
}

const ReadyStatuses: GameStatus[] = [
      GameStatus.Disconnected, GameStatus.Player1Won,
      GameStatus.Player2Won, GameStatus.Draw, GameStatus.Cancelled
];
export { ReadyStatuses };
