const express = require('express');
const contractRoutes = express.Router();
const contractController = require('../controllers/contract.controller');
const { ensureAuthenticated, ensureIsAuthenticatedAdmin } = require('../middleware/verifyAuth');


//Admin routes
contractRoutes.post('/contract', ensureIsAuthenticatedAdmin, contractController.createContract);

//All user routes
contractRoutes.put('/contract/:id', ensureAuthenticated, contractController.updateContract)

module.exports = contractRoutes;