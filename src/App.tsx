import React from 'react';
import { useRef } from 'react';
import io from 'socket.io-client';
import Board from './components/Board';
import {Game, GameStatus, ReadyStatuses, Direction, StatusMessages} from './structures';

const SOCKET_SERVER = 'http://192.168.1.106:5000';
const socket = io(SOCKET_SERVER);

function App() {
  const boardRef = useRef<any>(null);
  const [game, setGame] = React.useState<Game>({
      status: GameStatus.Disconnected,
      game_id: 0,
      player: 0,
      moves: ''
  });

  const matchGame = () => {
    socket.connect();
    socket.emit('match');
    if ( boardRef.current ) boardRef.current.resetMasterBoard();
  }
  const leaveGame = () => socket.emit('leave');
  const makeMove = (row: number, direction: Direction) => {
      socket.emit('move', {'move': direction.toString() + row.toString()});
  }

  socket.on('game', (game: Game) => {
    setGame(game)
    if ( ReadyStatuses.includes(game.status) ) {
        socket.disconnect();
    }
  });

  return (
    <div className="App">
      <div>{ StatusMessages[game.status] }</div>
      {ReadyStatuses.includes(game.status) && (
        <button className="cta" onClick={matchGame}>Join Game</button>
      )}
      {!ReadyStatuses.includes(game.status) && (
          <button className="cta negative" onClick={leaveGame}>Leave Game</button>
      )}
      <Board rows={7} columns={7} game={game} onMove={makeMove} ref={boardRef} />
    </div>
  );
}

export default App;
