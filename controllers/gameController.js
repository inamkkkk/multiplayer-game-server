// This file can contain controllers for HTTP routes (e.g., fetching game history).
// Since the core logic is in WebSockets, this file might not be essential for the basic Tic-Tac-Toe game.

// Example controller function (not used in the core WebSocket game)
const getGameHistory = (req, res) => {
  res.status(200).json({ message: 'Game history not implemented' });
};

module.exports = { getGameHistory };
