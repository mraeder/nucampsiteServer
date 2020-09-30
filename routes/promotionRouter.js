const express = require('express');          // In the node-express/routes folder, create a Node module named promotionRouter.js that will implement the Express router for /promotions and /promotions/:promotionId
const bodyParser = require('body-parser');   // using body parser middleware 
const Promotion = require('../models/promotion');  // promotion model 
const authenticate = require('../authenticate');
const cors = require('./cors');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());   // declaring use of body parser middleware

promotionRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {     // get request to get all docs in the collection
        Promotion.find()
        .then(promotions => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions);
        })
        .catch(err => next(err)); 
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotion.create(req.body)
        .then(promotion => {
            console.log('Promotion Created ', promotion);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        })
        .catch(err => next(err)); 
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {       // put request that is not supported
        res.statusCode = 403;
        res.end('PUT operation not supported on /promotions');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {   // delete request for deleting any docs in promotion collection
        Promotion.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err)); 
    })

    promotionRouter.route('/:promotionId') 
    .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, (req, res, next) => {            // get request for getting all promotions with ID matching requested ID
        Promotion.findById(req.params.promotionId)
        .then(promotion => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        })
        .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // post request that is not supported
        res.statusCode = 403;
        res.end(`POST operation not supported on /promotions/${req.params.promotionId}`); 
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {      // put request for updating any promotions with ID matching ID requested
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
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {      // delete request for deleting any promotions with ID matching ID requested
        Promotion.findByIdAndDelete(req.params.promotionId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err)); 
    })

module.exports = promotionRouter;