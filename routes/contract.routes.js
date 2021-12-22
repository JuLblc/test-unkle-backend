const express = require('express');
const contractRoutes = express.Router();
const contractController = require('../controllers/contract.controller');
const { ensureAuthenticated, ensureIsAuthenticatedAdmin } = require('../middleware/verifyAuth');


//Admin routes
contractRoutes.post('/contract', ensureIsAuthenticatedAdmin, contractController.createContract);
contractRoutes.get('/contracts', ensureIsAuthenticatedAdmin, contractController.getAllContracts)

//All user routes
contractRoutes.put('/contract/:id', ensureAuthenticated, contractController.updateContract)
contractRoutes.get('/contract', ensureAuthenticated, contractController.getContracts)

module.exports = contractRoutes;