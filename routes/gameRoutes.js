// This file can be used for HTTP routes if needed (e.g., for an API endpoint to fetch game history)
// Since the core logic is in WebSockets, this file might not be essential for the basic Tic-Tac-Toe game.

const express = require('express');
const router = express.Router();

// Example route (not used in the core WebSocket game)
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = router;
