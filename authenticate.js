const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate())); // add specific strategy plugin to passport implementation 
passport.serializeUser(User.serializeUser());  // serialize
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyAdmin = ((req, res, next) => {    // Create and export a new function named verifyAdmin()
    console.log(req.user.admin, 'Hello');
    if (req.user.admin) {    // req.user.admin to find out if user is an administrator
        return next();       // have the verifyAdmin() function return next(); if the user is an admin
    } else {
        res.statusCode = 403;  // If not, status property to 403 
        err = new Error("You are not authorized to perform this operation!");   // create a new Error object with the message "You are not authorized to perform this operation!"
        return next(err);   // return next(err)
    }
})