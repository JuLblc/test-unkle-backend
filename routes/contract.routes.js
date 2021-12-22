const express = require('express');
const contractRoutes = express.Router();
const contractController = require('../controllers/contract.controller');
const { ensureIsAuthenticatedAdmin } = require('../middleware/verifyAuth');


//Admin routes
contractRoutes.post('/contract', ensureIsAuthenticatedAdmin, contractController.createContract);

module.exports = contractRoutes;