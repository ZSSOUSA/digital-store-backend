const express = require('express');
const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.post('/user/token', AuthController.login);

module.exports = router;
