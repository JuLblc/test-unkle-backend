const moment = require('moment');

const User = require('../models/User.model');
const Contract = require('../models/Contract.model');
const Option = require('../models/Option.model');

module.exports.createContract = (req, res) => {

  const { start, end, options, clients } = req.body;

  const startDate = moment(start, "DD/MM/YYYY").toDate();

  //End Date is not mandatory
  let endDate;
  if (end) {
    endDate = moment(end, "DD/MM/YYYY").toDate();
  }

  //Delete potential dupplicate
  const filteredOptions = options.filter((item, index)=> options.indexOf(item) === index);
  const filteredClients = clients.filter((item, index)=> clients.indexOf(item) === index);

  //Define status according to the Date
  let status = '';
  if (startDate > new Date()) {
    status = 'pending';
  } else {
    status = 'active';
  }

  Contract.create({
    startingDate: startDate,
    endingDate: endDate,
    status: status
  })
    .then(aNewContract => {

      addOptionContract(filteredOptions, aNewContract.id)
      addClientContract(filteredClients, aNewContract.id)
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

const addClientContract = async (emails, contractId) => {

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

  console.log('resolvedClients: ',resolvedClients)

  //Building an Array of "option" instances
  for (const client of resolvedClients) {
    let clt = await User.findByPk(client.value.dataValues.id)
    clientsToSave.push(clt)
  }

  //Save Contract <-> Option in join table
  const contractToSave = await Contract.findByPk(contractId);
  await contractToSave.addUsers(clientsToSave)
}