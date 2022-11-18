import React from "react";
import { useRef } from "react";
import io from "socket.io-client";
import Board from "./components/Board";
import {
  Game,
  GameStatus,
  ReadyStatuses,
  Direction,
  StatusMessages,
  CellState
} from "./structures";
import Smart from "./smart";
import GameRules from "./gameRules";

const SOCKET_SERVER = "http://54.235.114.223:5000";
const socket = io(SOCKET_SERVER);

function App() {
  const boardRef = useRef<any>(null);
  const [fullname, setFullname] = React.useState<string>("");
  const [gameCode, setGameCode] = React.useState<number>(0);
  const [error, setError] = React.useState<string>("");
  const [isSoloGame, setIsSoloGame] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (error) alert(error);
  }, [error]);

  const [game, setGame] = React.useState<Game>({
    status: GameStatus.Disconnected,
    game_id: 0,
    player: 0,
    moves: "",
  });

  const startSolo = () => {
      setGame({
        status: GameStatus.Player1Turn,
        game_id: 0,
        player: 1,
        moves: ""
      });
      setIsSoloGame(true);
      boardRef.current.resetMasterBoard();
  }
  const stopSolo = () => {
    setGame({
        status: GameStatus.Disconnected,
        game_id: 0,
        player: 0,
        moves: ""
    });
    setIsSoloGame(false);
  }


  const matchGame = () => {
    socket.connect();
    socket.emit("match", { fullname, code: gameCode });
    if (boardRef.current) boardRef.current.resetMasterBoard();
  };
  const leaveGame = () => socket.emit("leave");
  const makeMove = (row: number, direction: Direction) => {
    if ( !isSoloGame ) {
        socket.emit("move", { move: direction.toString() + row.toString() });
        return
    }

    if ( game.status === GameStatus.Player1Turn ) {
        setGame((prev) => {
            const newMoves = prev.moves + direction.toString() + row.toString() + "/"
            return {
                ...prev,
                moves: newMoves,
                status: GameStatus.Player2Turn
            }
        });
    }
  };

  React.useEffect(() => {
    if ( game.status === GameStatus.Player2Turn || game.status === GameStatus.Player1Turn ) {
    }
    if (isSoloGame ) {
      boardRef.current.getMasterBoard()
        .then((updatedBoard: CellState[][]) => {
            const gameStatus = GameRules.getGameStatus(updatedBoard);
            setGame((prev) => {
                return { ...prev, status: gameStatus }
            });
            if ( ReadyStatuses.includes(gameStatus) ) return

            if ( game.status === GameStatus.Player2Turn ) {
                setTimeout(() => {
                    const move = Smart.findMove(updatedBoard);
                    makeMove(move.row, move.direction);
                    setGame((prev) => {
                        const newMoves = prev.moves + move.direction.toString() + move.row.toString() + "/"
                        return {
                            ...prev,
                            moves: newMoves,
                            status: GameStatus.Player1Turn
                        }
                    });
                }, 0);
            }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.status]);


  socket.on("error", (error: string) => {
    socket.disconnect();
    setError(error);
  });

  socket.on("game", (game: Game) => {
    setGame(game);
    if (ReadyStatuses.includes(game.status)) {
      socket.disconnect();
    }
  });

  return (
    <div className="App">
      <div>{StatusMessages[game.status]} | {game.game_id} </div>
      { isSoloGame && game.status === GameStatus.Player2Turn && (
            <div>Thinking...</div>
      )}
      { !isSoloGame && (
        <div>
            <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="input-basic"
                placeholder="Fullname"
            />
            <input
                type="number"
                value={gameCode}
                onChange={(e) => setGameCode(parseInt(e.target.value))}
                className="input-basic"
                placeholder="Game Code"
            />
          {ReadyStatuses.includes(game.status) && (
            <button className="cta" onClick={matchGame}>
              Join Game
            </button>
          )}
          {!ReadyStatuses.includes(game.status) && (
            <button className="cta negative" onClick={leaveGame}>
              Leave Game
            </button>
          )}
        </div>
      )}

      { isSoloGame && (
        <button onClick={() => stopSolo()}>Stop</button>
      )}
      { !isSoloGame && (
        <button onClick={() => startSolo()}>Play Dumb Computer</button>
      )}
      <Board
        rows={7}
        columns={7}
        game={game}
        onMove={makeMove}
        ref={boardRef}
      />
    </div>
  );
}

export default App;
