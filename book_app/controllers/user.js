//http://code.tutsplus.com/tutorials/token-based-authentication-with-angularjs-nodejs--cms-22543
//http://www.sitepoint.com/using-json-web-tokens-node-js/
var express = require('express');
var router = express.Router();
var user = require('../controllers/user.js');
var UserModel = require('../models/User.js');

/**
 * @api {get} /api/user Get User
 * @apiName GetUser
 * @apiGroup User
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} user_id Id of the User.
 * @apiSuccess {String} first_name  FirstName of the User.
 * @apiSuccess {String} middle_name LastName of the User.
 * @apiSuccess {String} last_name LastName of the User.
 * @apiSuccess {String} institute_id Institution of the User.
 * @apiSuccess {String} mobile_no Mobile No of the User.
 * @apiSuccess {String} email_id Email of the User.
 * @apiSuccess {String} user_id Firstname of the User.
 * @apiSuccessExample Success-Response:
 *   HTTP/1.1 200 OK
 *     "data": {
 *  "result": [
 *     {
 *      "user_id": 1,
 *      "first_name": "Pandit",
 *      "middle_name": "M",
 *      "last_name": "Biradar",
 *      "institute_id": 1,
 *      "mobile_no": 1,
 *      "email_id": null
 *     },
 *    }
 *
 * @apiError UserNotFound The No users are availabe
 *
 * @apiErrorExample Error-Response:
 * {
 *  "data": {
 *   "result": [],
 *  "responseCode": 400,
 *   "responseDesc": "Invalid route- Please pass the user id'"
 * },
 *  "HTTPCode": 400
 * }
 */
router.get('/', function(req, res, next) {
    //console.log('req data:', req);
    console.log('req.user data:', req.userData);
    var params = {
        id: 1
    };
    var userInstance = new UserModel(req.userData);
    userInstance.getUsers(function(err, users) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(users);
        }
    });
});

/**
 * @api {get} /api/user/:userId Get Specified User
 * @apiName GetUser
 * @apiGroup User
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} user_id Id of the User.
 * @apiSuccess {String} first_name  FirstName of the User.
 * @apiSuccess {String} middle_name LastName of the User.
 * @apiSuccess {String} last_name LastName of the User.
 * @apiSuccess {String} institute_id Institution of the User.
 * @apiSuccess {String} mobile_no Mobile No of the User.
 * @apiSuccess {String} email_id Email of the User.
 * @apiSuccess {String} user_id Firstname of the User.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "data": {
 *  "result": [
 *     {
 *      "user_id": 1,
 *      "first_name": "Pandit",
 *      "middle_name": "M",
 *      "last_name": "Biradar",
 *      "institute_id": 1,
 *      "mobile_no": 1,
 *      "email_id": as@gmail.com
 *     },
 *    }
 *
 * @apiError UserNotFound The No users are availabe
 *
 * @apiErrorExample Error-Response:
 * {
 *  "data": {
 *   "result": [],
 *  "responseCode": 400,
 *   "responseDesc": "Invalid route- Please pass the user id'"
 * },
 *  "HTTPCode": 400
 * }
 */
router.get('/:userId', function(req, res, next) {
    if (req.params.userId) {
        var userInstance = new UserModel(req.userData);
        userInstance.getUserById(req.params.userId, function(err, user) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json(user);
            }
        });
    } else {
        res.status(400).json({
            error: 'Invalid route- Please pass the user id'
        });
    }
});


/**
 * @api {post} /api/user New User
 * @apiName PostUser
 * @apiGroup User
 * @apiVersion 0.1.0
 * @apiParam {Integer} user_id Id of the User.
 * @apiParam {String} first_name  FirstName of the User.
 * @apiParam {String} middle_name LastName of the User.
 * @apiParam {String} last_name LastName of the User.
 * @apiParam {String} institute_id Institution of the User.
 * @apiParam {String} mobile_no Mobile No of the User.
 * @apiParam {String} email_id Email of the User.
 * @apiParam {String} user_id Firstname of the User.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 * {
 * "data": {
 *   "result": 0,
 *   "responseCode": 0,
 *  "responseDesc": "Successfully Process the Request"
 * },
 * "HTTPCode": 0
 * }
 *
 * 	@apiError UserAddError  HTTPCode": 500 Internale Server Error , 400 BAD Request
 */
router.post('/', function(req, res, next) {
    //create framework for validating req payload.
    //if required request parameters are not found. Then throw response message as parameters required.
    var userInstance = new UserModel({});
    userInstance.save(req.body, function(err, response) {
        console.log('Registered callback...');
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(201).json(response);
        }
    });
});

/**
 * @api {put} /api/user/:userId Edit User
 * @apiName PutUser
 * @apiGroup User
 * @apiVersion 0.1.0
 * @apiParam {Integer} user_id Id of the User.
 * @apiParam {String} first_name  FirstName of the User.
 * @apiParam {String} middle_name LastName of the User.
 * @apiParam {String} last_name LastName of the User.
 * @apiParam {String} institute_id Institution of the User.
 * @apiParam {String} mobile_no Mobile No of the User.
 * @apiParam {String} email_id Email of the User.
 * @apiParam {String} user_id Firstname of the User.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 202 Accepted
 * {
 * "data": {
 *   "result": 0,
 *   "responseCode": 202
 *  "responseDesc": "Successfully Processed the Request"
 * },
 * "HTTPCode": 200
 * }
 * @apiError UserEditError  HTTPCode": 500 Internale Server Error , 400 BAD Request
 */
router.put('/:userId', function(req, res, next) {
    if (req.params.userId) {
        var userInstance = new UserModel({});
        userInstance.update(req.body, req.params.userId, function(err, response) {
            console.log('Update callback...');
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(202).json(response);
            }
        });
    } else {
        res.status(400).json({
            error: 'Invalid route- Please pass the user id'
        });
    }
});

/**
 * @api {delete} /api/user/:userId Delete User
 * @apiName DeleteUser
 * @apiGroup User
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} user_id Id of the User.
 * @apiSuccess {String} first_name  FirstName of the User.
 * @apiSuccess {String} middle_name LastName of the User.
 * @apiSuccess {String} last_name LastName of the User.
 * @apiSuccess {String} institute_id Institution of the User.
 * @apiSuccess {String} mobile_no Mobile No of the User.
 * @apiSuccess {String} email_id Email of the User.
 * @apiSuccess {String} user_id Firstname of the User.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * @apiError UserDeleteError Invalid route- Please pass the user id
 *
 * @apiErrorExample Error-Response:
 * {
 *  "data": {
 *   "result": [],
 *  "responseCode": 400,500
 *   "responseDesc": "Invalid route- Please pass the user id/ Internal Server error"
 * },
 *  "HTTPCode": 400
 * }
 */
router.delete('/:userId', function(req, res, next) {
    if (req.params.userId) {
        var userInstance = new UserModel({});
        userInstance.delete(req.params.userId, function(err, response) {
            console.log('delete callback...');
            if (err) {
                res.status(500).json(err);
            } else {
                res.status(200).json(response);
            }
        });
    } else {
        res.status(400).json({
            error: 'Invalid route- Please pass the user id'
        });
    }
});

module.exports = router;
