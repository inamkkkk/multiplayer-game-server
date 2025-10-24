# Tic-Tac-Toe Multiplayer Server

A simple Tic-Tac-Toe multiplayer game server built with Node.js and WebSockets.

## Features

*   Real-time multiplayer gameplay using WebSockets.
*   Basic game logic for Tic-Tac-Toe.
*   Simple matchmaking.

## Project Structure


├── README.md
├── server.js
├── routes
│   └── gameRoutes.js
├── controllers
│   └── gameController.js
├── models
│   └── Game.js
├── middlewares
│   └── errorHandler.js
├── utils
│   └── socketHandler.js
└── package.json


## Installation

1.  Clone the repository:

    
    git clone <repository_url>
    cd tic-tac-toe-server
    

2.  Install dependencies:

    
    npm install
    

## Usage

1.  Start the server:

    
    npm start
    

2.  Connect clients to the WebSocket endpoint `ws://localhost:3000`.

## API Endpoints

### WebSocket

*   `/ws`: Establishes a WebSocket connection for real-time game communication.

## Message Format (WebSocket)

*   `join`: Request to join a game. If no game is available, a new game is created.  Example: `{ "type": "join" }`
*   `move`:  Send a player move.  Example: `{ "type": "move", "gameId": "<gameId>", "cell": 2 }`
*   `state`:  Game state update from server to clients. Example: `{ "type": "state", "board": [null, "X", null, null, "O", null, null, null, "X"], "currentPlayer": "O", "winner": null, "gameId": "<gameId>" }`
*   `error`: Error message from server to clients. Example: `{ "type": "error", "message": "Invalid move" }`
*   `waiting`: Server informs client that it's waiting for an opponent. Example: `{ "type": "waiting" }`

