const express = require('express');    
const User = require('../models/user');  // require user model, .. = down 1 directory before accessing models directory
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', (req, res) => {
  User.register(new User({username: req.body.username}),
  req.body.password, (err, user) => {
      if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
      } else {
          if (req.body.firstname) {
              user.firstname = req.body.firstname;
          }
          if (req.body.lastname) {
              user.lastname = req.body.lastname;
          }
          user.save(err => {  // save this to DB
              if (err) {      // handle errors within a callback 
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({err: err});
                  return;
              }
              passport.authenticate('local')(req, res, () => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json({success: true, status: 'Registration Successful!'});
              });
          });
      }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({_id: req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'You are successfully logged in!'});
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