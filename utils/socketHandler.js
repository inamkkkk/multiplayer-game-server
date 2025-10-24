const { v4: uuidv4 } = require('uuid');

const games = {};
const players = {};

const handleWebSocket = (ws, wss) => {
  ws.id = uuidv4();
  players[ws.id] = ws;

  ws.on('message', message => {
    try {
      const parsedMessage = JSON.parse(message);
      const type = parsedMessage.type;

      switch (type) {
        case 'join':
          handleJoin(ws, wss);
          break;
        case 'move':
          handleMove(ws, parsedMessage);
          break;
        default:
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message type' }));
      }
    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid JSON format' }));
    }
  });

  ws.on('close', () => {
    console.log(`Client disconnected: ${ws.id}`);
    for (const gameId in games) {
      const game = games[gameId];
      if (game.player1 === ws.id || game.player2 === ws.id) {
        if (game.player1 === ws.id && game.player2) {
          players[game.player2].send(JSON.stringify({ type: 'opponentLeft' }));
        } else if (game.player2 === ws.id && game.player1){
           players[game.player1].send(JSON.stringify({ type: 'opponentLeft' }));
        }

        delete games[gameId];
        break;
      }
    }
    delete players[ws.id];
  });

  ws.on('error', error => {
    console.error(`WebSocket error: ${error}`);
  });
};

const handleJoin = (ws, wss) => {
  let availableGameId = null;
  for (const gameId in games) {
    if (games[gameId].player2 === null) {
      availableGameId = gameId;
      break;
    }
  }

  if (availableGameId) {
    // Join existing game
    const game = games[availableGameId];
    game.player2 = ws.id;
    game.currentPlayer = game.player1; //Player 1 always starts

    ws.gameId = availableGameId;

    players[game.player1].send(JSON.stringify({ type: 'opponentJoined', gameId: availableGameId }));
    ws.send(JSON.stringify({ type: 'gameJoined', gameId: availableGameId }));
    sendGameState(availableGameId);
  } else {
    // Create new game
    const newGameId = uuidv4();
    games[newGameId] = {
      player1: ws.id,
      player2: null,
      board: Array(9).fill(null),
      currentPlayer: null,
      winner: null,
    };
    ws.gameId = newGameId;
    ws.send(JSON.stringify({ type: 'waiting' }));
  }
};

const handleMove = (ws, message) => {
  const gameId = message.gameId;
  const cell = message.cell;
  const game = games[gameId];

  if (!game) {
    ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
    return;
  }

  if (ws.id !== game.currentPlayer) {
    ws.send(JSON.stringify({ type: 'error', message: 'Not your turn' }));
    return;
  }

  if (game.board[cell] !== null) {
    ws.send(JSON.stringify({ type: 'error', message: 'Cell already taken' }));
    return;
  }

  game.board[cell] = ws.id === game.player1 ? 'X' : 'O';

  game.winner = calculateWinner(game.board);

  if (game.winner) {
    console.log(`Game ${gameId} won by ${game.winner}`);
  }

  game.currentPlayer = ws.id === game.player1 ? game.player2 : game.player1;
  sendGameState(gameId);
};

const sendGameState = gameId => {
  const game = games[gameId];
  const gameState = {
    type: 'state',
    board: game.board,
    currentPlayer: game.currentPlayer === game.player1 ? 'X' : 'O',
    winner: game.winner === game.player1 ? 'X' : game.winner === game.player2 ? 'O' : null,
    gameId: gameId,
  };

  if(game.player1){
      players[game.player1].send(JSON.stringify(gameState));
  }
  if(game.player2){
      players[game.player2].send(JSON.stringify(gameState));
  }

};

const calculateWinner = board => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

module.exports = { handleWebSocket };