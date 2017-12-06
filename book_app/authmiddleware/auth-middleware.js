//http://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543
//http://www.sitepoint.com/using-json-web-tokens-node-js/

var config = require('config');
var jwt = require('jwt-simple');
var moment = require('moment');
var Authentication = require('../models/Auth.js');

module.exports = function(req, res, next) {
    console.log('Middlwware');
    //get "authorization" token from either of one. Surley from header
    var token = (req.body && req.body.authorization) || (req.query && req.query.authorization) || req.headers['authorization'];
    var bearerToken;
    var app = req.app;
    console.log('token:', token);
    //request headers are intercepted and the authorization header is extracted. If a bearer token exists in this header, that token is assigned
    if (typeof token !== 'undefined') {
        var bearer = token.split(" ");
        bearerToken = bearer[1];
        token = bearerToken;
    } else {
        return res.status(403).json({
            error: 'Forbidden: Token does not exists.'
        });
    }

    if (token) {
        try {
            var jwtSecrete;
            if ('localdev' === process.env.NODE_ENV) {
                if (config && config.jwt && config.jwt.secret) {
                    jwtSecrete = config.jwt.secret;
                }
            } else {
                //get from env variable.
                //jwtSecrete = process.env.JWT_SECRET;
                jwtSecrete = app.get('jwtTokenSecret'); //get JWT secrete
            }
            var decoded = jwt.decode(token, jwtSecrete);
            //If token has expired end the request with 400.
            if (decoded.exp <= Date.now()) {
                return res.status(401).json({
                    error: 'Access token has expired. Please Renew it.'
                });
            }

            //Get the iss(unique field of the user and add to the request object.
            var auth = new Authentication();
            console.log('decoded.is:', decoded.iss);
            auth.getUserById(decoded.iss, function(err, user) {
                console.log('user:', user);
                if (err) {
                    return res.status(500).json({
                        error: true,
                        data: {
                            message: err
                        }
                    });
                } else if (!user) {
                    return res.status(401).json({
                        error: 'Email or Password is wrong.'
                    });
                } else {
                    req.userData = user;
                    console.log('req.userData:', req.userData);
                    next();
                }
            });
        } catch (err) {
            res.status(500).json({
                error: 'Internal Service Error'
            });
        }
    } else {
        return res.status(401).json({
            error: 'Invalid access token'
        });
    }
};
