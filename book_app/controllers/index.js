var express = require('express');
var router = express.Router();

var userRouter = require('./user');
var auth = require('./auth');
var addressRouter = require('./address');
var institutionRouter = require('./institution');
var bookRouter = require('./book');
var emailRouter = require('./emailer');
var lookupRouter = require('./streamLookup');
var transactionRouter = require('./transaction');
var rackRouter = require('./rack');

module.exports = function(app) {
    //default route
    router.get('/', function(req, res, next) {
        res.status(200).send({
            message: 'hello'
        });
    });

    app.use('/', router);

    //User Authentication and registration
    app.use('/', auth);
    app.use('/api/user', userRouter);
    app.use('/api/address', addressRouter);
    app.use('/api/institution', institutionRouter);
    app.use('/api/book', bookRouter);
    app.use('/api/streamlookup', lookupRouter);
    app.use('/api/transaction', transactionRouter);
    app.use('/api/rack', rackRouter);

    app.use('/api/email', emailRouter);

    //use another routes below
};
