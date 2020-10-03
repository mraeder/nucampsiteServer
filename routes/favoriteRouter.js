const express = require('express');  // Using the require function, import the express module
const Favorite = require('../models/favorite');  // import favorite 
const authenticate = require('../authenticate');  // import authenticate
const cors = require('./cors');  // import cors 

const favoriteRouter = express.Router();  // Create the favoriteRouter using the express.Router() method as you have done in other router modules
  
favoriteRouter.route('/')  //Set up a route using favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))  // Preflight requests to both routes using the .options() method as you have done in the other routers, with the cors.corsWithOptions function as the first middleware in the .options method's argument list, followed by a request handler middleware that simply responds with a status code of 200
.get(cors.cors, authenticate.verifyUser, (req, res, next) => { //  Chain .get() methods to both routes giving the cors.cors function

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {  // Chain .post(), .put(), and .delete() methods to both routes, giving the cors.corsWithOptions function as the first middleware in their argument lists

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {  // Chain .post(), .put(), and .delete() methods to both routes, giving the cors.corsWithOptions function as the first middleware in their argument lists

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {   // Chain .post(), .put(), and .delete() methods to both routes, giving the cors.corsWithOptions function as the first middleware in their argument lists



favoriteRouter.route('/:campsiteId')  // Set up a route using favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))  // Preflight requests to both routes using the .options() method as you have done in the other routers, with the cors.corsWithOptions function as the first middleware in the .options method's argument list, followed by a request handler middleware that simply responds with a status code of 200
.get(cors.cors, authenticate.verifyUser, (req, res) => { //  Chain .get() methods to both routes giving the cors.cors function
        
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => { // Chain .post(), .put(), and .delete() methods to both routes, giving the cors.corsWithOptions function as the first middleware in their argument lists

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {  // Chain .post(), .put(), and .delete() methods to both routes, giving the cors.corsWithOptions function as the first middleware in their argument lists

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {  // Chain .post(), .put(), and .delete() methods to both routes, giving the cors.corsWithOptions function as the first middleware in their argument lists


module.exports = favoriteRouter;  // export favoriteRouter