//http://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543
//http://www.sitepoint.com/using-json-web-tokens-node-js/
var express = require('express');
var router = express.Router();
var user = require('../controllers/user.js');
var UserModel = require('../models/User.js');
var Authentication = require('../models/Auth.js');
var jwt = require('jwt-simple');

router.post('/register', function(req, res, next) {
    //create framework for validating req payload.
    //if required request parameters are not found. Then throw response message as parameters required.
    //Validate required body parameters
    var userInstance = new UserModel({});
    userInstance.register(req.body, function(err, response) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(response);
        }
    });
});

router.post('/authenticate', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var app = req.app;
    console.log('Requested auth');
    if (email && password) {
        var params = {
            email: email,
            password: password,
        };

        var auth = new Authentication();
        auth.login(params, function(err, user) {
            if (err) {
                return res.status(500).json({
                    error: true,
                    message: "Error occured: " + err
                });
            }
            if (user) {
                var expires = GLOBAL.moment().add('days', 365).valueOf();
                var token = jwt.encode({
                    iss: user[0].user_id, //should be unique
                    exp: expires
                }, app.get('jwtTokenSecret'));

                return res.json({
                    type: true,
                    token: token,
                    expires: expires,
                    user: user
                });
            } else {
                return res.json({
                    type: false,
                    message: "Incorrect username or password."
                });
            }
        });
    } else {
        return res.status(400).json({
            error: 'Invalid route- Required parameters missing.'
        });
    }
});

module.exports = router;
