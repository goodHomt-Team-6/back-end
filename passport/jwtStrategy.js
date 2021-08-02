const passport = require('passport');
require('dotenv').config();
const { ExtractJwt, Strategy: JWTStrategy } = require('passport-jwt');
const User = require('../models/user');

const JWTConfig = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = () => {
  passport.use(
    'jwt',
    new JWTStrategy(JWTConfig, async (jwtPayload, done) => {
      try {
        const email = jwtPayload.email;
        const user = await User.findOne({
          attributes: ['id', 'email', 'nickname', 'provider'],
          where: {
            email,
          },
        });
        if (user) {
          done(null, user);
        } else {
          done(null, false, { message: '올바르지 않은 인증정보 입니다.' });
        }
      } catch (error) {
        done(error);
      }
    })
  );
};
