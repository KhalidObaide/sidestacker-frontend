import React from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import Board from './components/Board';
import {Game, GameStatus, ReadyStatuses} from './structures';

const SOCKET_SERVER = 'http://192.168.1.106:5000';
const socket = io(SOCKET_SERVER);

function App() {
  const [game, setGame] = React.useState<Game>({
      status: GameStatus.Disconnected,
      game_id: 0,
      player: 0
  });

  const joinGame = () => {
    socket.connect();
    socket.emit('match');
  }

  socket.on('game', (game: Game) => {
    setGame(game)
    if ( ReadyStatuses.includes(game.status) ) {
        socket.disconnect();
    }
  });

  const leaveGame = () => {
      socket.emit('leave');
  }

  return (
    <div className="App">
      {ReadyStatuses.includes(game.status) && (
        <button className="cta" onClick={joinGame}>Join Game</button>
      )}
      {!ReadyStatuses.includes(game.status) && (
          <button className="cta negative" onClick={leaveGame}>Leave Game</button>
      )}
      <Board rows={7} columns={7} game={game} />
    </div>
  );
}

export default App;
