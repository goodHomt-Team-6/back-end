const passport = require('passport');
const kakao = require('./kakaoStrategy');
const google = require('./googleStrategy');
const User = require('../models/User');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((_id, done) => {
    User.find({ _id })
      .then((user) => {
        done(null, user);
      })
      .catch((err) => done(err));
  });

  kakao();
  google();
};
