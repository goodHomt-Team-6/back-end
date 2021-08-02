const passport = require('passport');

exports.authenticateJWT = (req, res, next) =>
  passport.authenticate('jwt', { sessions: false }, (error, user, message) => {
    if (user) {
      req.loginUser = user;
      next();
    } else {
      const error = new Error(message);
      error.status = 403;
      next(error);
    }
  })(req, res, next);
