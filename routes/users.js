const express = require('express');    
const User = require('../models/user');  // require user model, .. = down 1 directory before accessing models directory

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {   // this endpoint allows new user to register on the website. middleware argument = (req, res, next)
    User.findOne({username: req.body.username})  // see if any existing users with name the user inputted
    .then(user => {
        if (user) {    // if this evaluates as truthy, then it found a user with a matching username
            const err = new Error(`User ${req.body.username} already exists!`);  // response message that would show up to user 
            err.status = 403;
            return next(err);
        } else {       // user variable is falsy, okay to create this new user doc 
            User.create({
                username: req.body.username,  // argument = req.body.username
                password: req.body.password})
            .then(user => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({status: 'Registration Successful!', user: user});  // res.json method to send 'registration successful' message to user
            })
            .catch(err => next(err));  // catch any errors
        }
    })
    .catch(err => next(err));  // catch error if find.one method returned error
});

router.post('/login', (req, res, next) => {  // post request + middleware
    if(!req.session.user) {  // checks if they're already logged into a session 
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            const err = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }
      
        const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = auth[0];
        const password = auth[1];
      
        User.findOne({username: username})  // check client's inputted user and pass against what we have in our docs
        .then(user => {
            if (!user) {
                const err = new Error(`User ${username} does not exist!`);
                err.status = 401;
                return next(err);
            } else if (user.password !== password) {    // if we find a matching username, check if also matching password
                const err = new Error('Your password is incorrect!');  // send this message if password doesn't match 
                err.status = 401;
                return next(err);
            } else if (user.username === username && user.password === password) {
                req.session.user = 'authenticated';
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/plain');
                res.end('You are authenticated!')
            }
        })
        .catch(err => next(err));
    } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are already authenticated!');
    }
});

router.get('/logout', (req, res, next) => {  // user leaves, stop trackcing session 
    if (req.session) {  
      req.session.destroy();
      res.clearCookie('session-id');  // clear cookie stored on client
      res.redirect('/');  // redirect user to localhost:3000
    } else {      // client is requesting to log out even though they weren't logged in
      const err = new Error('You are not logged in!');
      err.status = 401;
      return next(err);
    }
});

module.exports = router;