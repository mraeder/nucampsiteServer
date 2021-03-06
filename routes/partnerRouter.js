const express = require('express');   // express middleware 
const bodyParser = require('body-parser');  // body parser middleware
const Partner = require('../models/partner');   // update the response to each defined endpoint using the new Partner and Promotion Model
const authenticate = require('../authenticate');
const cors = require('./cors');

const partnerRouter = express.Router();

partnerRouter.use(bodyParser.json());    // using body parser middleware

partnerRouter.route('/')             // Create a Node module named partnerRouter.js that will implement the Express router for /partners and /partners/:partnerId
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {           // get request to get all docs in collection 
        Partner.find()
        .then(partners => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partners);
        })
        .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { 
        Partner.create(req.body)
        .then(partner => {
            console.log('Partner created ', partner);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner)
        })
        .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {             // put request that is not supported
        res.statusCode = 403;
        res.end('PUT operation not supported on /partners');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Partner.deleteMany()
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err));
    })

    partnerRouter.route('/:partnerId') 
        .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
        .get(cors.cors, (req, res, next) => {          // get request to get all partners with ID matching requested ID
        Partner.findById(req.params.partnerId)
        .then(partner => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner);
        })
        .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // post request that is not supported
        res.statusCode = 403;
        res.end(`POST operation not supported on /partners/${req.params.partnerId}`); 
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {           // put request updating any partners with ID matching ID requested
        Partner.findByIdAndUpdate(req.params.partnerId, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => { // ****** JONAH fixed this bug. Still might be wrong ******
            $set: req.body
        }, { new: true })
        .then(partner => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(partner); 
        })
        .catch(err => next(err)); 
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {       // delete request for deleting any partners with ID matching ID requested
        Partner.findByIdAndDelete(req.params.partnerId)
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        })
        .catch(err => next(err)); 
    })

module.exports = partnerRouter;