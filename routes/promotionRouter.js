const express = require('express');          // In the node-express/routes folder, create a Node module named promotionRouter.js that will implement the Express router for /promotions and /promotions/:promotionId
const bodyParser = require('body-parser');   // using body parser middleware 
const Promotion = require('../models/promotion');  // promotion model 
const authenticate = require('../authenticate');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());   // declaring use of body parser middleware

promotionRouter.route('/')               // Endpoints: Write a route() method on the router for each of the paths above, just as you did with the campsiteRouter...     
    .get((req, res, next) => {     // get request to get all docs in the collection
        Promotion.find()
        .then(promotions => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions);
        })
        .catch(err => next(err)); 
    })
    .post(authenticate.verifyUser, (req, res, next) => {     // create new doc in promotion collection
        Promotion.create(req.body)
        .then(promotion => {
            console.log('Promotion Created ', promotion);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        })
        .catch(err => next(err)); 
    })
    .put(authenticate.verifyUser, (req, res) => {          // put request that is not supported
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {     // delete request for deleting any docs in promotion collection
        Promotion.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err)); 
    })

    promotionRouter.route('/:promotionId') 
    .get((req, res, next) => {            // get request for getting all promotions with ID matching requested ID
        Promotion.findById(req.params.promotionId)
        .then(promotion => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        })
        .catch(err => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => { // post request that is not supported
        res.statusCode = 403;
        res.end(`POST operation not supported on /promotions/${req.params.promotionId}`); 
    })
    .put(authenticate.verifyUser, (req, res) => {        // put request for updating any promotions with ID matching ID requested
        Promotion.findByIdAndUpdate(req.params.promotionId, {
            $set: req.body
        }, { new: true })
        .then(promotion => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion); 
        })
        .catch(err => next(err)); 
    })
    .delete(authenticate.verifyUser, (req, res, next) => {       // delete request for deleting any promotions with ID matching ID requested
        Promotion.findByIdAndDelete(req.params.promotionId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err)); 
    })

module.exports = promotionRouter;