var express = require('express');
var router = express.Router();
var book = require('../controllers/streamLookup.js');
var LookupModel = require('../models/StreamLookup.js');

/**
 * @api {get} /api/streamLookup/ Get Stream
 * @apiName StreamLookup
 * @apiGroup StreamLookup
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} stream_lookup_id  id of stream .
 * @apiSuccess {String} stream_lookup_name  name of stream
 * @apiSuccessExample Success-Response:
 * {
 * "data": {
 *   "result": [
 *     {
 *       "stream_lookup_id": 1,
 *       "stream_lookup_name": "Civil"
 *    }
 *   ],
 *  "responseCode": 0,
 *   "responseDesc": "Successfully Proccessed Request"
 *  },
 * "HTTPCode": 0
 * }
 *
 * @apiError StreamLookupNotFound Not availbe the Stream
 *
 * @apiErrorExample Error-Response:
 * {
 *  "data": {
 *   "result": [],
 *  "responseCode": 400,
 *   "responseDesc": "Invalid URL'"
* },
*  "HTTPCode": 400
* }
*/
router.get('/', function(req, res, next){
	
	var lookupInstance = new LookupModel(req.data);
	lookupInstance.getStreamLookup(function(err, lookup){
		if(err){
			res.status(500).json(err);
		} else {
			res.json(lookup);
		}
	});
	
});

/**
 * @api {get} /api/streamLookup/:lookupId  Get Specified Stream
 * @apiName StreamByID
 * @apiGroup StreamLookup
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} stream_lookup_id  id of stream .
 * @apiSuccess {String} stream_lookup_name  name of stream
 * @apiSuccessExample Success-Response:
 * {
 * "data": {
 *   "result": [
 *     {
 *       "stream_lookup_id": 1,
 *       "stream_lookup_name": "Civil"
 *    }
 *   ],
 *  "responseCode": 0,
 *   "responseDesc": "Successfully Proccessed Request"
 *  },
 * "HTTPCode": 0
 * }
 *
 * @apiError StreamLookupNotFound Not available the Stream
 *
 * @apiErrorExample Error-Response:
 * {
 *  "data": {
 *   "result": [],
 *  "responseCode": 400,
 *   "responseDesc": "Invalid route- Please pass the lookup id'"
* },
*  "HTTPCode": 400
* }
*/
router.get('/:lookupId', function(req, res, next){
	if(req.params.lookupId){
		var lookupInstance = new LookupModel(req.data);
		lookupInstance.getStreamLookupById(req.params.lookupId, function(err, lookup){
			if(err){
				res.status(500).json(err);
			} else{
				res.json(lookup);
			}
		});
	} else{
		res.status(400).json({error:'Invalid route- Please pass the lookup  id'});
	}
});

module.exports = router;