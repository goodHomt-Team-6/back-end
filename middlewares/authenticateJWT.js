const passport = require('passport');

module.exports = (req, res, next) =>
  passport.authenticate('jwt', { sessions: false }, (error, user, message) => {
    if (user) {
      req.user = user;
      next();
    } else {
      const error = new Error('인증정보가 올바르지 않습니다');
      error.status = 403;
      next(error);
    }
  })(req, res, next);
