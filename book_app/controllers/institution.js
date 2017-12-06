var express = require('express');
var router = express.Router();
var inst = require('../controllers/institution.js');
var Institution = require('../models/Institution.js');

/**
 * @api {get} /api/institution/:userId Get Institution
 * @apiName GetInstitution
 * @apiGroup Institution
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} institution_info_id  id of institution .
 * @apiSuccess {Integer} user_id  id of User
 * @apiSuccess {String} name  institution name.
 * @apiSuccess {String} university university name.
 * @apiSuccess {String} country country.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "data": {
 *    "result": [
 *     {
 *        "institution_info_id": 2,
 *        "user_id": 1,
 *        "name": "National PUC College Bidar",
 *        "university": "PU Board Bengaluru",
 *        "state": "Karnataka",
 *        "country": null,
 *        "first_name": "Pandit",
 *        "middle_name": "M",
 *        "last_name": "Biradar",
 *        "institute_id": 1,
 *        "mobile_no": 1,
 *       "email_id": null
 *     }
 *    ],
 *    "responseCode": 0,
 *    "responseDesc": "Successfully Proccessed Request"
 *  },
 *  "HTTPCode": 0
 * }
 *
 * @apiError InstitutionNotFound No Institution available
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
router.get('/:userId', function(req, res, next){
	if(req.params.userId){
	var instInstance = new Institution(req.addressData);
	instInstance.getUserInst(req.params.userId, function(err, inst){
		if(err){
			res.status(500).json(err);
		} else {
			res.json(inst);
		}
	});
	}
	 else{
		res.status(400).json({error:'Invalid route- Please pass the user id'});
	}
});

/**
 * @api {get} /api/institution/:userId/id/:instId Get Specified Institution
 * @apiName GetInstitutionByID
 * @apiGroup Institution
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} institution_info_id  id of institution .
 * @apiSuccess {Integer} user_id  id of User
 * @apiSuccess {String} name  institution name.
 * @apiSuccess {String} university university name.
 * @apiSuccess {String} country country.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 * "data": {
 *    "result": [
 *     {
 *        "institution_info_id": 2,
 *        "user_id": 1,
 *        "name": "National PUC College Bidar",
 *        "university": "PU Board Bengaluru",
 *        "state": "Karnataka",
 *        "country": null,
 *        "first_name": "Pandit",
 *        "middle_name": "M",
 *        "last_name": "Biradar",
 *        "institute_id": 1,
 *        "mobile_no": 1,
 *       "email_id": null
 *     }
 *    ],
 *    "responseCode": 0,
 *    "responseDesc": "Successfully Proccessed Request"
 *  },
 *  "HTTPCode": 0
 * }
 *
 * @apiError InstitutionNotFound No Institutaion availabe
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
router.get('/:userId/id/:instId', function(req, res, next){
	if(req.params.userId){
		var instInstance = new Institution(req.adressData);
		instInstance.getUserInstById(req.params.userId, req.params.instId, function(err, inst){
			if(err){
				res.status(500).json(err);
			} else{
				res.json(inst);
			}
		});
	} else{
		res.status(400).json({error:'Invalid route- Please pass the user  id'});
	}
});

/**
 * @api {post} /api/institution/:userId/ New Institution
 * @apiName  PostInstitution
 * @apiGroup Institution
 * @apiVersion 0.1.0
 * @apiParam {Integer} institution_info_id  id of institution .
 * @apiParam {Integer} user_id  id of User
 * @apiParam {String} name  institution name.
 * @apiParam {String} university university name.
 * @apiParam {String} country country.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 201 OK
 * {
 * "data": {
 *   "result": 0,
 *   "responseCode": 0,
 *  "responseDesc": "Successfully Processed the Request "
 * },
 * "HTTPCode": 0
 * }
 *
 * 	@apiError InstitutionAddError  HTTPCode: 500 Internale Server Error , 400 BAD Request
*/
router.post('/:userId', function(req, res, next){
	var instInstance = new Institution({});
	instInstance.save(req.params.userId, req.body, function(err, response){
		console.log('Add new User callback...');
		if(err){
			res.status(500).json(err);
		} else{
			res.status(201).json(response);
		}
	});
});

/**
 * @api {put} /api/institution/:userId/id/:instId Edit Institution 
 * @apiName PutInstitution
 * @apiGroup Institution
 * @apiVersion 0.1.0
 * @apiParam {Integer} institution_info_id  id of institution .
 * @apiParam {Integer} user_id  id of User
 * @apiParam {String} name  institution name.
 * @apiParam {String} university university name.
 * @apiParam {String} country country.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 202 OK
 * {
 * "data": {
 *   "result": 0,
 *   "responseCode": 400
 *  "responseDesc": "BAD Request"
 * },
 * "HTTPCode": 400
 * }
 * @apiError InstitutionEditError  HTTPCode: 500 Internale Server Error , 400 BAD Request
 * }
 
 router.put('/:userId/id/:instId', function(req, res, next){
*/
router.put('/:userId/:instId', function(req, res, next){
	if(req.params.instId) {
		var instInstance = new Institution({});
		instInstance.update(req.params.userId,req.body, req.params.instId,function(err, response){
			console.log('Update callback...');
			if(err){
				res.status(500).json(err);
			} else{
				res.status(202).json(response);
			}
		});
	} else{
		res.status(400).json({error:'Invalid route- Please pass the user id'});
	}
});

/**
 * @api {delete} /api/institution/:userId/id/:instId  Delete Institution
 * @apiName DeleteInstitution
 * @apiGroup Institution
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} institution_info_id  id of institution .
 * @apiSuccess {Integer} user_id  id of User
 * @apiSuccess {String} name  institution name.
 * @apiSuccess {String} university university name.
 * @apiSuccess {String} country country.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 203 OK
 * @apiError InstitutionDeleteError Invalid route- Please pass the user id
 *
 * @apiErrorExample Error-Response:
 * {
 *  "data": {
 *   "result": [],
 *  "responseCode": 500, 400
 *   "responseDesc": "Invalid route- Please pass the adress id / Internal Server Error"
* },
*  "HTTPCode": 500,400
* }
*/
router.delete('/:userId/id/:instId', function(req, res, next){
	if(req.params.instId) {
		var instInstance = new Institution({});
		instInstance.delete(req.params.userId,req.params.instId,function(err, response){
			console.log('delete callback...');
			if(err){
				res.status(500).json(err);
			} else{
				res.status(200).json(response);
			}
		});
	} else{
		res.status(400).json({error:'Invalid route- Please pass the user id'});
	}
});

module.exports = router;