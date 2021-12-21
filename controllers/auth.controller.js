const passport = require('passport');

module.exports.login = (req, res) => {

  passport.authenticate('local', (err, theUser, failureDetails) => {

    if (err) {
      // Something went wrong authenticating user
      res.status(400).json({ message: err.message });
      return;
    }

    if (!theUser) {
      // Unauthorized, `failureDetails` contains the error messages from our logic in "LocalStrategy" {message: '…'}.
      res.status(403).json(failureDetails);
      return;
    }

    // save user in session: req.user
    req.login(theUser, err => {
      if (err) {
        // Session save went bad
        res.status(400).json({ message: err.message });
        return;
      }

      // All good, we are now logged in and `req.user` is now set
      res.status(201).json(theUser);
    });
  })(req, res);
}

module.exports.logout = (req, res) => {
  let user = req.user;
  req.logout();
  res.status(200).json({ message: `${user.email} deconnected`, user: false });
}