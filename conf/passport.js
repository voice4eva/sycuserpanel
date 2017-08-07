const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const conf = require('../conf/db');

module.exports = (passport)=>{
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = conf.secret;
  passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
    User.getUserById(jwt_payload._doc._id, (err, user)=> {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    });
}));
}
