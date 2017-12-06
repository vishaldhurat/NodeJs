var express = require('express');
var app = express();
var config = require('config'); //nodejs config module
var errorHandler = require('errorhandler');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var methodOverride = require('method-override');
var JWTAuthMiddleware = require('./authmiddleware/auth-middleware.js');
var helmet = require('helmet');
var compression = require('compression');

GLOBAL.db = require('./db-connection/DB.js');
GLOBAL.async = require('async');
GLOBAL.config = require('./helpers/error-messages.js');
GLOBAL.envConfig = require('config');
GLOBAL.moment = require('moment');
GLOBAL.mysql = require('mysql');

(function main() {

    //Set port
    var serverPort = 8443; //default
    console.log('ENV:', config.environment);
    if (config.server && config.server.port) {
        serverPort = config.server.port;
    }
    var port = process.env.PORT || serverPort; // set our port

    //Protects the application from some well known web vulnerabilities by setting HTTP headers appropriately.
    app.use(helmet());

    //Decrease the size of the response body to increase the speed of a web application using gzip
    app.use(compression());

    //Override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
    app.use(methodOverride('X-HTTP-Method-Override'));

    //Set the static files location /public/img will be /img for users
    app.use(express.static(__dirname + '/public'));

    //Use body parser
    app.use(bodyParser.json());
    //app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
    //app.use(bodyParser.json({ type: 'application/json' }));
    //app.use(bodyParser.urlencoded({ extended: true }));

    if (GLOBAL.SQLpool === undefined) {
        //create a global sql pool connection
        GLOBAL.SQLpool = GLOBAL.db.createPool();
        //console.log('GLOBAL.SQLpool:', GLOBAL.SQLpool);
    }

    //If local get jwtTokenSecret from config.
    if ('localdev' === app.get('env')) {
        if (config && config.jwt && config.jwt.secret) {
            app.set('jwtTokenSecret', config.jwt.secret); //get JWT secrete
        }
    } else {
        //in production/development server comment below line.
        app.set('jwtTokenSecret', config.jwt.secret); //get JWT secrete

        //get from env variable.
        //in production/development server un-comment below line.
        //app.set('jwtTokenSecret', process.env.JWT_SECRET);//get JWT secrete

        //if getting services that matches "regular expression ('/api/*')" the go through JWTAuthMiddleware module middle ware to prove valid user/token.
        //app.all('/api/*', [JWTAuthMiddleware]);  //un-comment this if u want jwt auth.Necessory when it is on dev and prod or when made public
    }


    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // intercept OPTIONS method
        if ('OPTIONS' === req.method) {
            res.send(200);
        } else {
            next();
        }
    };
    app.use(allowCrossDomain);

    app.all('/api/*', [JWTAuthMiddleware]);

    require('./controllers')(app); //all routes are handled here

    //on unhandles exception callback
    /*process.on('uncaughtException', function(err) {
        console.log('uncaughtException:',err); //send an email to admin
    });*/

    // error handling middleware should be loaded after the loading the routes
    if ('localdev' === app.get('env')) {
        app.use(errorHandler());
    }

    //Start the Application now
    app.listen(port, function() {
        console.log('Server is started on port - ', port);
    });
})();
