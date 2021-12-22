const moment = require('moment');

const User = require('../models/User.model');
const Contract = require('../models/Contract.model');
const Option = require('../models/Option.model');
const UserContract = require('../models/UserContract.model');

module.exports.createContract = (req, res) => {

  const { start, end, options, clients } = req.body;

  //Check mandatory fields
  if (!start || !options || !clients) {
    res.status(400).json({ message: "Merci de saisir une date de démarrage, les options du contrat et les clients." });
    return
  }

  const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime()
  const startDate = moment(start, "DD/MM/YYYY").toDate().getTime()

  //End Date is not mandatory
  let endDate;
  if (end) {
    endDate = moment(end, "DD/MM/YYYY").toDate().getTime();

    if (endDate < startDate) {
      res.status(400).json({ message: "La date de fin du contrat doit être ultérieure à la date de démarrage" });
      return
    }
  }

  //Delete potential dupplicate
  const filteredOptions = options.filter((item, index) => options.indexOf(item) === index);
  const filteredClients = clients.filter((item, index) => clients.indexOf(item) === index);

  // Define status according to the Date
  let status = '';
  if (startDate > currentDate) {
    status = 'pending';
  }
  if (startDate < currentDate) {
    status = 'active';
  }
  if (endDate < currentDate) {
    status = 'finished';
  }

  Contract.create({
    startingDate: startDate,
    // endingDate: endDate,
  })
    .then(aNewContract => {

      addOptionContract(filteredOptions, aNewContract.id)
      addClientContract(filteredClients, aNewContract.id, status, endDate)

      res.status(201).json(aNewContract.dataValues);
    })
    .catch(err => {
      res.status(400).json({ message: "Une erreur lors de la création du contrat s'est produite." });
    })
}

const addOptionContract = async (options, contractId) => {

  const optionPromises = [];

  //Getting optionId according to description
  options.forEach(option => {
    optionPromises.push(
      Option.findOne({
        where: {
          description: option
        }
      })
    )
  })

  const resolvedOptions = await Promise.allSettled(optionPromises)
  const optionsToSave = [];

  //Building an Array of "option" instances
  for (const option of resolvedOptions) {
    let opt = await Option.findByPk(option.value.dataValues.id)
    optionsToSave.push(opt)
  }

  //Save Contract <-> Option in join table
  const contractToSave = await Contract.findByPk(contractId);
  await contractToSave.addOptions(optionsToSave)
}

const addClientContract = async (emails, contractId, status, endDate) => {

  const clientPromises = [];

  //Getting optionId according to description
  emails.forEach(email => {
    clientPromises.push(
      User.findOne({
        where: {
          email: email
        }
      })
    )
  })

  const resolvedClients = await Promise.allSettled(clientPromises)
  const clientsToSave = [];

  //Building an Array of "option" instances
  for (const client of resolvedClients) {
    let clt = await User.findByPk(client.value.dataValues.id)
    clientsToSave.push(clt)
  }

  //Save Contract <-> Option in join table
  const contractToSave = await Contract.findByPk(contractId);
  await contractToSave.addUsers(clientsToSave)

  //Update join table status
  const userContracts = await UserContract.findAll({
    where: { contractId: contractId }
  })

  for (const userContract of userContracts) {
    userContract.status = status;
    userContract.endingDate = endDate;
    await userContract.save()
  }
}

module.exports.updateContract = async (req, res) => {

  const end = req.body.end;
  let clientId = req.body.clientId;
  let contractId = req.params.id;

  if (!end) {
    res.status(400).json({ message: 'Merci de saisir une date' });
    return;
  }

  //Getting user id depending of user role
  if (req.user.role === "admin" && !clientId) {
    res.status(400).json({ message: "Merci de saisir l'id du client" });
    return;
  }

  if (req.user.role === "user" && !clientId) {
    clientId = req.user.id;
  }

  const endDate = moment(end, "DD/MM/YYYY").toDate();
  const currentDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())

  if (endDate.getTime() < currentDate.getTime()) {
    res.status(400).json({ message: 'Merci de saisir une date égale ou supérieure à la date du jour' });
    return;
  }

  let status = ''
  if (endDate.toLocaleDateString() === currentDate.toLocaleDateString()) {
    status = 'finished';
  } else {
    status = 'active';
  }

  UserContract.findOne({
    where: {
      userId: clientId,
      contractId: contractId
    }
  })
    .then(userContract => {
      userContract.status = status;
      userContract.endingDate = endDate;
      userContract.save()
        .then(() => res.status(200).json({ message: `Contrat n° ${contractId} a été mis à jour avec succès` }))
        .catch(err => {
          res.status(400).json({ message: "Une erreur lors de la modification du contrat s'est produite." });
        })
    })
    .catch(err => {
      res.status(400).json({ message: "Une erreur lors de la modification du contrat s'est produite." });
    })
}