const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User routes',
  });
});

module.exports = router;
