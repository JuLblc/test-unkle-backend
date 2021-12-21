const express = require('express');
const userRoutes = express.Router();
const userController = require('../controllers/user.controller');
const { ensureAuthenticated, ensureIsAuthenticatedAdmin } = require('../middleware/verifyAuth');

//Admin routes
userRoutes.post('/user', ensureIsAuthenticatedAdmin, userController.createUser);
userRoutes.delete('/user', ensureIsAuthenticatedAdmin, userController.deleteUser);
userRoutes.get('/users', ensureIsAuthenticatedAdmin, userController.getAllUser);

//All user routes
userRoutes.get('/user', ensureAuthenticated, userController.getUser);

module.exports = userRoutes;