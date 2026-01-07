const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// When someone posts to /register, run the registerUser function
router.post('/register', registerUser);

// When someone posts to /login, run the loginUser function
router.post('/login', loginUser);

module.exports = router;