const passport = require('passport');
const User = require('../models/User.model');

module.exports.createUser = (req, res) => {

  const { email, password, role } = req.body;

  // Check if email is already in Database
  User.findOne({ where: { email: email } })
    .then(foundUserByEmail => {

      if (foundUserByEmail) {
        res.status(409).json({ message: 'Cette adresse E-mail est déjà utilisée' });
        return;
      }

      User.create({
        email: email,
        password: password,
        role: role
      })
        .then((aNewUser) => {
          res.status(201).json(aNewUser.dataValues);
        })
        .catch(err => {
          res.status(400).json({ message: "Une erreur lors de la création du compte s'est produite." });
        });
    })
    .catch(err => {
      res.status(400).json({ message: "Une erreur lors de la création de l'utilisateur s'est produite." });
    });
}

module.exports.deleteUser = (req, res) => {

  const { email } = req.body;

  // Check if email is already in Database
  User.findOne({ where: { email: email } })
    .then(foundUserByEmail => {

      if (!foundUserByEmail) {
        res.status(409).json({ message: 'Cet utilisateur est introuvable' });
        return;
      }

      foundUserByEmail.destroy({ where: { email: email } })
        .then(() => {
          res.status(201).json({ message: 'Utilisateur supprimé' });
        })
        .catch(err => {
          res.status(400).json({ message: "Une erreur lors de la suppression du compte s'est produite." });
        });
    })
    .catch(err => {
      res.status(400).json({ message: "Une erreur lors de la suppression du compte s'est produite." });
    });
}

module.exports.getAllUser = (req, res) => {

  User.findAll()
    .then(foundUsers => {
      res.status(200).json(foundUsers)
    })
    .catch(err => {
      res.status(400).json({ message: "Une erreur lors de la récupération des données utilisateurs s'est produite." });
    });
}

module.exports.getUser = (req, res) => {

  const id = req.user.id

  User.findByPk(id)
    .then(foundUser => {
      res.status(200).json(foundUser)
    })
    .catch(err => {
      res.status(400).json({ message: "Une erreur lors de la récupération des données utilisateur s'est produite." });
    });
}