var express = require('express');
var router = express.Router();
var address = require('../controllers/address.js');
var AddressModel = require('../models/Address.js');

/**
 * @api {get} /api/address/:userId GET Address
 * @apiName GetUserAddress
 * @apiGroup UserAddress
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} address_id  id of Address.
 * @apiSuccess {Integer} user_id  id of User
 * @apiSuccess {String} house_no  house number.
 * @apiSuccess {String} street street name.
 * @apiSuccess {String} landmark landmark.
 * @apiSuccess {String} Area Area.
 * @apiSuccess {String} city Mobile No of the User.
 * @apiSuccess {Integer} pincode pincode .
 * @apiSuccess {String} state state.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * "data": {
 *   "result": [
 *    {
 *       "address_id": 3,
 *       "user_id": 8,
 *       "house_no": "2013",
 *       "street": "Rama Temple",
 *       "landmark": "Rama Temple",
 *       "Area": "Tippsandra",
 *       "city": "Bengaluru",
 *       "pincode": 560075,
 *       "state": "Karnataka",
 *       "first_name": "Deva",
 *       "middle_name": "R",
 *       "last_name": "Patil",
 *       "institute_id": 1,
 *       "mobile_no": 1,
 *       "email_id": null
 *    }
 *   ],
 *	"responseCode": 0,
 *   "responseDesc": "Successfully Proccessed Request"
 * },
 * "HTTPCode": 0
 * }
 * @apiError UserAddressNotFound No AddressFound for the user
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
	var adressInstance = new AddressModel(req.addressData);
	adressInstance.getUserAdress(req.params.userId, function(err, address){
		if(err){
			res.status(500).json(err);
		} else {
			res.json(address);
		}
	});
	}
	 else{
		res.status(400).json({error:'Invalid route- Please pass the user id'});
	}
});

/**
 * @api {get} /api/address/:userId/id/:addressId GET Specified Address
 * @apiName GetUserAddressbyID
 * @apiGroup UserAddress
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} address_id  id of Address.
 * @apiSuccess {Integer} user_id  id of User
 * @apiSuccess {String} house_no  house number.
 * @apiSuccess {String} street street name.
 * @apiSuccess {String} landmark landmark.
 * @apiSuccess {String} Area Area.
 * @apiSuccess {String} city Mobile No of the User.
 * @apiSuccess {Integer} pincode pincode .
 * @apiSuccess {String} state state.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * "data": {
 *   "result": [
 *    {
 *       "address_id": 3,
 *       "user_id": 8,
 *       "house_no": "2013",
 *       "street": "Rama Temple",
 *       "landmark": "Rama Temple",
 *       "Area": "Tippsandra",
 *       "city": "Bengaluru",
 *       "pincode": 560075,
 *       "state": "Karnataka",
 *       "first_name": "Deva",
 *       "middle_name": "R",
 *       "last_name": "Patil",
 *       "institute_id": 1,
 *       "mobile_no": 1,
 *       "email_id": null
 *    }
 *   ],
 *	"responseCode": 0,
 *   "responseDesc": "Successfully Proccessed Request"
 * },
 * "HTTPCode": 0
 * }
 *
 * @apiError UserAddressNotFound No AddressFound for the user
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
router.get('/:userId/id/:addressId', function(req, res, next){
	if(req.params.userId){
		var adressInstance = new AddressModel(req.adressData);
		adressInstance.getUserAdressById(req.params.userId, req.params.addressId, function(err, address){
			if(err){
				res.status(500).json(err);
			} else{
				res.json(address);
			}
		});
	} else{
		res.status(400).json({error:'Invalid route- Please pass the user  id'});
	}
});

/**
 * @api {post} /api/address/:userId  New Address
 * @apiName PostUserAddress
 * @apiGroup UserAddress
 * @apiVersion 0.1.0
 * @apiParam {Integer} address_id  id of Address.
 * @apiParam {Integer} user_id  id of User
 * @apiParam {String} house_no  house number.
 * @apiParam {String} street street name.
 * @apiParam {String} landmark landmark.
 * @apiParam {String} Area Area.
 * @apiParam {String} city Mobile No of the User.
 * @apiParam {Integer} pincode pincode .
 * @apiParam {String} state state.
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
 * 	@apiError UserAddressAddError  HTTPCode: 500 Internale Server Error , 400 BAD Request
*/
router.post('/:userId', function(req, res, next){
	var adressInstance = new AddressModel({});
	adressInstance.save(req.params.userId, req.body, function(err, response){
		console.log('Add new User callback...');
		if(err){
			res.status(500).json(err);
		} else{
			res.status(201).json(response);
		}
	});
});

/**
 * @api {put} /api/address/:userId/id/:adressId Edit Address
 * @apiName PutUserAddress
 * @apiGroup UserAddress
 * @apiVersion 0.1.0
 * @apiParam {Integer} address_id  id of Address.
 * @apiParam {Integer} user_id  id of User
 * @apiParam {String} house_no  house number.
 * @apiParam {String} street street name.
 * @apiParam {String} landmark landmark.
 * @apiParam {String} Area Area.
 * @apiParam {String} city Mobile No of the User.
 * @apiParam {Integer} pincode pincode .
 * @apiParam {String} state state.
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
 * @apiError UserAddressEditError  HTTPCode: 500 Internale Server Error , 400 BAD Request
 */
router.put('/:userId/id/:adressId', function(req, res, next){
	if(req.params.adressId) {
		var adressInstance = new AddressModel({});
		adressInstance.update(req.params.userId,req.body, req.params.adressId,function(err, response){
			console.log('Update callback...');
			if(err){
				res.status(500).json(err);
			} else{
				res.status(202).json(response);
			}
		});
	} else{
		res.status(400).json({error:'Invalid route- Please pass the adress id'});
	}
});

/**
 * @api {delete} /api/address/:userId/id/:adressId  Delete Address
 * @apiName DeleteUserAdreess
 * @apiGroup UserAddress
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} address_id  id of Address.
 * @apiSuccess {Integer} user_id  id of User
 * @apiSuccess {String} house_no  house number.
 * @apiSuccess {String} street street name.
 * @apiSuccess {String} landmark landmark.
 * @apiSuccess {String} Area Area.
 * @apiSuccess {String} city Mobile No of the User.
 * @apiSuccess {Integer} pincode pincode .
 * @apiSuccess {String} state state.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 203 OK
 * @apiError UserAddressDeleteError Invalid route- Please pass the user id
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
router.delete('/:userId/id/:adressId', function(req, res, next){
	if(req.params.adressId) {
		var adressInstance = new AddressModel({});
		adressInstance.delete(req.params.userId,req.params.adressId,function(err, response){
			console.log('delete callback...');
			if(err){
				res.status(500).json(err);
			} else{
				res.status(200).json(response);
			}
		});
	} else{
		res.status(400).json({error:'Invalid route- Please pass the adress id'});
	}
});

module.exports = router;