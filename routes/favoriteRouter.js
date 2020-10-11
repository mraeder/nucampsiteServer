const express = require('express');  // Using the require function, import the express module
const bodyParser = require('body-parser');
const Favorite = require('../models/favorite');  // import favorite 
const authenticate = require('../authenticate');  // import authenticate
const cors = require('./cors');  // import cors 

const favoriteRouter = express.Router();  // Create the favoriteRouter using the express.Router() method as you have done in other router modules
  
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')  //Set up a route using favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))  // Preflight requests to both routes using the .options() method as you have done in the other routers, with the cors.corsWithOptions function as the first middleware in the .options method's argument list, followed by a request handler middleware that simply responds with a status code of 200
.get(cors.cors, authenticate.verifyUser, (req, res, next) => { //  Chain .get() methods to both routes giving the cors.cors function. 2nd argument = authenticate.verifyUser. Add a final request handling middleware function to each of the get/post/put/delete routes Give the function arguments of req, res, and next 
    Favorite.find()
    .populate('favorite.user', 'favorite.campsite')  // When the user does a GET operation on '/favorites', retrieve the list of favorites for the that user, then populate the user and campsites refs before returning the favorites 
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {  // Chain .post(), .put(), and .delete() methods to both routes, giving the cors.corsWithOptions function as the first middleware in their argument lists
    Favorite.findOne({user: req.user._id})   // POST to /favorites: When the user does a POST operation on '/favorites' by including a message in the format of [{"_id":"campsite ObjectId"},  . . . , {"_id":"campsite ObjectId"}] in the body of the message (see Testing section for example), you will check if the user has an associated favorite document.
    .then(favorite => {  
        if (favorite) {
            Favorite.create({user: req.user._id, campsites: req.body})
            .then(favorite => { // ****** JONAH fixed this bug ******
                console.log('Favorite Created', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        .catch(err => next(err));
    } else { // ****** JONAH fixed this bug ******
            req.body.forEach(campsite => {
                if (favorite.campsites.includes(campsite._id)) {
                    err = new Error('Favorite document already exists');
                    err.status = 404;
                    return next(err); 
                } else {
                    favorite.campsites.push(campsite._id);
                }
            });
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {  // Chain .post(), .put(), and .delete() methods to both routes, giving the cors.corsWithOptions function as the first middleware in their argument lists
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites`)})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {   // Chain .post(), .put(), and .delete() methods to both routes, giving the cors.corsWithOptions function as the first middleware in their argument lists
    Favorite.deleteOne( {user: req.user._id} )
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});


favoriteRouter.route('/:campsiteId')  // Set up a route using favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))  // Preflight requests to both routes using the .options() method as you have done in the other routers, with the cors.corsWithOptions function as the first middleware in the .options method's argument list, followed by a request handler middleware that simply responds with a status code of 200
.get(cors.cors, authenticate.verifyUser, (req, res) => { //  Chain .get() methods to both routes giving the cors.cors function
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`)})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // Chain .post(), .put(), and .delete() methods to both routes, giving the cors.corsWithOptions function as the first middleware in their argument lists
    Favorite.findOne( {user: req.user._id} )
    .then(favorite => {
        if (favorite) {
            if (!favorite.campsites.includes(req.params.campsiteId)) {
                favorite.campsites.push(req.params.campsiteId);
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch(err => next(err));
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text');
                res.end(`That campsite is already listed as a favorite.`);
            }
        } else {
            Favorite.create( {user: req.user._id, campsites: [req.params.campsiteId] } ) 
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }) 
            .catch(err => next(err));
        }
    }).catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {  // Chain .post(), .put(), and .delete() methods to both routes, giving the cors.corsWithOptions function as the first middleware in their argument lists
    res.statusCode = 403;
    res.end(`PUT operation not supported on /favorites/${req.params.campsiteId}`)})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {  // Chain .post(), .put(), and .delete() methods to both routes, giving the cors.corsWithOptions function as the first middleware in their argument lists
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
            const index = favorite.campsites.indexOf(req.params.campsiteId);
            if (index > -1) {
                favorite.campsites.splice(index);
                favorite.save()
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text');
                res.end(`The campsite was removed from favorites.`);
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text');
                res.end(`That campsite is not favorited.`);   
            }
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text');
            res.end(`No campsites in favorites.`); 
        }
    })
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));
});

module.exports = favoriteRouter;  // export favoriteRouter