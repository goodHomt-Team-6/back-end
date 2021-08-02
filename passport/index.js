const passport = require('passport');
const kakao = require('./kakaoStrategy');
const google = require('./googleStrategy');
const jwt = require('./jwtStrategy');

const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    done(null, 'No session');
    // User.findOne({ id })
    //   .then((user) => {
    //     done(null, user);
    //   })
    //   .catch((err) => done(err));
  });

  kakao();
  google();
  jwt();
};
