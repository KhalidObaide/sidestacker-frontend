
import { Direction, CellState } from "./structures";

class Smart {
    static getValidMoves(board: CellState[][]): Set<string> {
        const moves = new Set([Direction.Left, Direction.Right].map((direction) => {
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
        }).flat());
        return moves;
    }

    static findMove(board: CellState[][]) {
        const allMoves = Smart.getValidMoves(board);
        const randomMove = Array.from(allMoves)[Math.floor(Math.random() * allMoves.size)];
        return {
            direction: randomMove[0] as Direction,
            row: parseInt(randomMove[1])
        }
    }

}

export default Smart;
