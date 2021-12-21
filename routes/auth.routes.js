const express = require('express');
const authRoutes = express.Router();
const authController = require('../controllers/auth.controller');
const { ensureAuthenticated, ensureNotAuthenticated, isAuthenticated } = require('../middleware/verifyAuth');

authRoutes.post('/sessions', ensureNotAuthenticated, authController.login);

module.exports = authRoutes;