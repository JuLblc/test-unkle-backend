module.exports.ensureNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // The user is authenticated
    // and we have access to the logged user in req.user
    res.status(403).json({ message: 'not authorized: already logged in' });
  } else {
    return next();
  }
}