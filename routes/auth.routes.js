const express = require('express');
const authRoutes = express.Router();
const authController = require('../controllers/auth.controller');
const { ensureAuthenticated, ensureNotAuthenticated } = require('../middleware/verifyAuth');

authRoutes.post('/sessions', ensureNotAuthenticated, authController.login);

authRoutes.delete('/session', ensureAuthenticated, authController.logout);

module.exports = authRoutes;