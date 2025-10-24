const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { handleWebSocket } = require('./utils/socketHandler');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
  handleWebSocket(ws, wss);
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
