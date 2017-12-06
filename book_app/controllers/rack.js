var express = require('express');
var router = express.Router();
var rack = require('../controllers/rack.js');
var Rack = require('../models/Rack.js');

/**
 * @api {get} /api/rack/ Get Rack
 * @apiName GetRack
 * @apiGroup Rack
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} rack_id  id of rack .
 * @apiSuccess {String} rack_name  name of rack(ie Stream)
 * @apiSuccess {String} book_id  id of Book.
 * @apiSuccess {String} book_status book status(Available,Pending,Deliver).
 * @apiSuccessExample Success-Response:
 * {
 * "data": {
 *   "result": [
 *     {
 *       "rack_id": 3,
 *       "rack_name": "Mechanical",
 *       "book_id": 2,
 *       "book_status": "pending",
 *       "user_id": 1,
 *       "book_name": "DSC ASC ",
 *       "book_author": "Narshima",
 *       "book_isbn_no": "121sdsds",
 *       "book_stream": "MECH",
 *       "book_edition": "2nd",
 *       "book_publisher": "Crarenet",
 *       "book_image_path": "User/Image/location",
 *       "book_price": null
 *     }
 *     ],
 *    "responseCode": 0,
 *    "responseDesc": "Successfully Proccessed Request"
 *  },
 *  "HTTPCode": 0
 * }
 *
 * @apiError RackNotFound No AddressFound for the user
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
router.get('/', function(req, res, next){
	var rackInstance = new Rack(req.data);
	rackInstance.getRack(function(err, rack){
		if(err){
			res.status(500).json(err);
		} else {
			res.json(rack);
		}
	});
});

/**
 * @api {get} /api/rack/search/:searchString  Search Rack
 * @apiName SearchRack
 * @apiGroup Rack
 * @apiVersion 0.1.0
 * @apiParam {String} searchString pass based on searchInfo param eg. if searchInfo is author then pass the authorname".
 * @apiParam {String} searchInfo Shoulde be "rack or status or author or isbn or stream or edition or publisher".
 * @apiSuccess {Integer} rack_id  id of rack .
 * @apiSuccess {String} rack_name  name of rack(ie Stream)
 * @apiSuccess {String} book_id  id of Book.
 * @apiSuccess {String} book_status book status(Available,Pending,Deliver).
 * @apiSuccessExample Success-Response:
 * {
 * "data": {
 *   "result": [
 *     {
 *       "rack_id": 3,
 *       "rack_name": "Mechanical",
 *       "book_id": 2,
 *       "book_status": "pending",
 *       "user_id": 1,
 *       "book_name": "DSC ASC ",
 *       "book_author": "Narshima",
 *       "book_isbn_no": "121sdsds",
 *       "book_stream": "MECH",
 *       "book_edition": "2nd",
 *       "book_publisher": "Crarenet",
 *       "book_image_path": "User/Image/location",
 *       "book_price": null
 *     }
 *     ],
 *    "responseCode": 0,
 *    "responseDesc": "Successfully Proccessed Request"
 *  },
 *  "HTTPCode": 0
 * }
 *
 * @apiError RackNotFound No AddressFound for the user
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
router.get('/search/:searchString', function(req, res, next){
		var rackInstance = new Rack(req.adressData);
		rackInstance.search(req.params.searchString, req.query.searchInfo, function(err, rack){
			if(err){
				res.status(500).json(err);
			} else{
				res.json(rack);
			}
		});
});


/**
 * @api {get} /api/rack/sort Sort Rack
 * @apiName SortRack
 * @apiGroup Rack
 * @apiVersion 0.1.0
 * @apiParam {String} sortInfo Shoulde be "rack or status or author or isbn or stream or edition or publisher".
 * @apiSuccess {Integer} rack_id  id of rack .
 * @apiSuccess {String} rack_name  name of rack(ie Stream)
 * @apiSuccess {String} book_id  id of Book.
 * @apiSuccess {String} book_status book status(Available,Pending,Deliver).
 * @apiSuccessExample Success-Response:
 * {
 * "data": {
 *   "result": [
 *     {
 *       "rack_id": 3,
 *       "rack_name": "Mechanical",
 *       "book_id": 2,
 *       "book_status": "pending",
 *       "user_id": 1,
 *       "book_name": "DSC ASC ",
 *       "book_author": "Narshima",
 *       "book_isbn_no": "121sdsds",
 *       "book_stream": "MECH",
 *       "book_edition": "2nd",
 *       "book_publisher": "Crarenet",
 *       "book_image_path": "User/Image/location",
 *       "book_price": null
 *     }
 *     ],
 *    "responseCode": 0,
 *    "responseDesc": "Successfully Proccessed Request"
 *  },
 *  "HTTPCode": 0
 * }
 *
 * @apiError RackNotFound No AddressFound for the user
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
router.get('/sort/', function(req, res, next){
		var rackInstance = new Rack(req.adressData);
		rackInstance.sort(req.query.sortInfo, function(err, rack){
			if(err){
				res.status(500).json(err);
			} else{
				res.json(rack);
			}
		});
});

/**
 * @api {post} /api/rack/ New Rack
 * @apiName  PostRack
 * @apiGroup Rack
 * @apiVersion 0.1.0
 * @apiParam {Integer} rack_id  id of rack .
 * @apiParam {String} rack_name  name of rack(ie Stream)
 * @apiParam {String} book_id  id of Book.
 * @apiParam {String} book_status book status(Available,Pending,Deliver).
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
 * 	@apiError RackAddError  HTTPCode: 500 Internale Server Error , 400 BAD Request
*/
router.post('/', function(req, res, next){
	var rackInstance = new Rack({});
	rackInstance.save(req.body, function(err, response){
		console.log('Add new Rack callback...');
		if(err){
			res.status(500).json(err);
		} else{
			res.status(201).json(response);
		}
	});
});

/**
 * @api {put} /api/rack/:rackId Edit Rack
 * @apiName PutRack
 * @apiGroup Rack
 * @apiVersion 0.1.0
 * @apiParam {Integer} rack_id  id of rack .
 * @apiParam {String} rack_name  name of rack(ie Stream)
 * @apiParam {String} book_id  id of Book.
 * @apiParam {String} book_status book status(Available,Pending,Deliver).
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
 * @apiError RackEditError  HTTPCode: 500 Internale Server Error , 400 BAD Request
*/
router.put('/:rackId', function(req, res, next){
	if(req.params.rackId) {
		var rackInstance = new Rack({});
		rackInstance.update(req.body, req.params.rackId,function(err, response){
			console.log('Update callback...');
			if(err){
				res.status(500).json(err);
			} else{
				res.status(202).json(response);
			}
		});
	} else{
		res.status(400).json({error:'Invalid route- Please pass the rack id'});
	}
});

/**
 * @api {delete} /api/rack/:rackId Delete Rack 
 * @apiName DeleteRack
 * @apiGroup Rack
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} rack_id  id of rack .
 * @apiSuccess {String} rack_name  name of rack(ie Stream)
 * @apiSuccess {String} book_id  id of Book.
 * @apiSuccess {String} book_status book status(Available,Pending,Deliver).
 * HTTP/1.1 203 OK
 * @apiError RackDeleteError Invalid route- Please pass the user id
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
router.delete('/:rackId', function(req, res, next){
	if(req.params.rackId) {
		var rackInstance = new Rack({});
		rackInstance.delete(req.params.rackId,function(err, response){
			console.log('delete callback...');
			if(err){
				res.status(500).json(err);
			} else{
				res.status(200).json(response);
			}
		});
	} else{
		res.status(400).json({error:'Invalid route- Please pass the rack id'});
	}
});

module.exports = router;