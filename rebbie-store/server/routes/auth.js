const express = require('express');
const router = express.Router();

const {
    loginUser,
    validateToken
} = require('../controllers/auth');

// Login endpoint
router.post('/login', loginUser);

// Token validation endpoint (optional, for checking if user is still authenticated)
router.post('/validate', validateToken);

module.exports = router;
