const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

exports.local = passport.use(new LocalStrategy(User.authenticate())); // add specific strategy plugin to passport implementation 
passport.serializeUser(User.serializeUser());  // serialize
passport.deserializeUser(User.deserializeUser());