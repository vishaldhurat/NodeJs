var express = require('express');
var router = express.Router();
var transaction = require('../controllers/transaction.js');
var TransactionModel = require('../models/Transaction.js');

/**
 * @api {get} /api/transaction Get Transaction 
 * @apiName GetTransaction
 * @apiGroup Transaction
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} transaction_id  id of Transaction.
 * @apiSuccess {Integer} book_id  id of Book
 * @apiSuccess {String} saler_user_id  sales user id.
 * @apiSuccess {String} buyer_user_id buyer user id
 * @apiSuccess {String} status status.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "data": {
 *  "result": [
 *    {
 *      "transaction_id": 1,
 *      "book_id": 2,
 *      "saler_user_id": 2,
 *      "buyer_user_id": 2,
 *      "status": "pending"
 *    }
 *   ],
 *	"responseCode": 0,
 *   "responseDesc": "Successfully Proccessed Request"
 * },
 * "HTTPCode": 0
 * }
 *
 * @apiError TransactionNotFound No transaction available
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
	var transactionInstance = new TransactionModel(req.data);
	transactionInstance.getTransaction(function(err, transaction){
		if(err){
			res.status(500).json(err);
		} else {
			res.json(transaction);
		}
	});
	
});

/**
 * @api {get} /api/transaction/:transactionId Get Specified Transaction
 * @apiName GetTransactionByID
 * @apiGroup Transaction
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} transaction_id  id of Transaction.
 * @apiSuccess {Integer} book_id  id of Book
 * @apiSuccess {String} saler_user_id  sales user id.
 * @apiSuccess {String} buyer_user_id buyer user id
 * @apiSuccess {String} status status.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "data": {
 *  "result": [
 *    {
 *      "transaction_id": 1,
 *      "book_id": 2,
 *      "saler_user_id": 2,
 *      "buyer_user_id": 2,
 *      "status": "pending"
 *    }
 *   ],
 *	"responseCode": 0,
 *   "responseDesc": "Successfully Proccessed Request"
 * },
 * "HTTPCode": 0
 * }
 *
 * @apiError TransactionNotFound No transaction available
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
router.get('/:transactionId', function(req, res, next){
	if(req.params.transactionId){
		var transactionInstance = new TransactionModel(req.data);
		transactionInstance.getTransactionId(req.params.transactionId,function(err, transaction){
			if(err){
				res.status(500).json(err);
			} else{
				res.json(transaction);
			}
		});
	} else{
		res.status(400).json({error:'Invalid route- Please pass the transaction  id'});
	}
});




 

/**
 * @api {get} /api/transaction/users/:userId Get Transaction Specified User
 * @apiName GetTransaction
 * @apiGroup Transaction
 * @apiVersion 0.1.0
 * @apiParam userType = "buy or sale"
 * @apiSuccess {Integer} transaction_id  id of Transaction.
 * @apiSuccess {Integer} book_id  id of Book
 * @apiSuccess {String} saler_user_id  sales user id.
 * @apiSuccess {String} buyer_user_id buyer user id
 * @apiSuccess {String} status status.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "data": {
 *  "result": [
 *    {
 *      "transaction_id": 1,
 *      "book_id": 2,
 *      "saler_user_id": 2,
 *      "buyer_user_id": 2,
 *      "status": "pending"
 *    }
 *   ],
 *	"responseCode": 0,
 *   "responseDesc": "Successfully Proccessed Request"
 * },
 * "HTTPCode": 0
 * }
 *
 * @apiError TransactionNotFound No transaction available
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
//router.get('/users/:userId/:userType', function(req, res, next){

router.get('/users/:userId/:userType', function(req, res, next){
 	var transactionInstance = new TransactionModel(req.data);
	transactionInstance.getTransactionByUser(req.params.userId,req.params.userType, function(err, transaction){
		if(err){
			res.status(500).json(err);
		} else {
			res.json(transaction);
		}
	});
});

/**
 * @api {post} /api/transaction New Transaction
 * @apiName  PostTransaction
 * @apiGroup Transaction
 * @apiVersion 0.1.0
 * @apiParam {Integer} transaction_id  id of Transaction.
 * @apiParam {Integer} book_id  id of Book
 * @apiParam {String} saler_user_id  sales user id.
 * @apiParam {String} buyer_user_id buyer user id
 * @apiParam {String} status status.
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
 * 	@apiError TransactionAddError  HTTPCode": 500 Internale Server Error , 400 BAD Request
*/
router.post('/', function(req, res, next){
	var transactionInstance = new TransactionModel({});
	transactionInstance.save(req.body, function(err, response){
		console.log('Add new transaction callback...');
		if(err){
			res.status(500).json(err);
		} else{
			res.status(201).json(response);
		}
	});
});

/**
 * @api {put} /api/transaction/:transactionId Edit Transaction 
 * @apiName PutTransaction
 * @apiGroup Transaction
 * @apiVersion 0.1.0
 * @apiParam {Integer} transaction_id  id of Transaction.
 * @apiParam {Integer} book_id  id of Book
 * @apiParam {String} saler_user_id  sales user id.
 * @apiParam {String} buyer_user_id buyer user id
 * @apiParam {String} status status.
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
 * @apiError TransactionEditError  HTTPCode": 500 Internale Server Error , 400 BAD Request
*/
router.put('/:transactionId', function(req, res, next){
	if(req.params.transactionId) {
		var transactionInstance = new TransactionModel({});
		transactionInstance.update(req.body, req.params.transactionId,function(err, response){
			console.log('Update callback...');
			if(err){
				res.status(500).json(err);
			} else{
				res.status(202).json(response);
			}
		});
	} else{
		res.status(400).json({error:'Invalid route- Please pass the transaction id'});
	}
});

/**
 * @api {delete} /api/transaction/:transactionId  Delete Transaction
 * @apiName DeleteTransaction
 * @apiGroup Transaction
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} transaction_id  id of Transaction.
 * @apiSuccess {Integer} book_id  id of Book
 * @apiSuccess {String} saler_user_id  sales user id.
 * @apiSuccess {String} buyer_user_id buyer user id
 * @apiSuccess {String} status status.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 203 OK
 * @apiError TransactionDeleteError Invalid route- Please pass the user id
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
router.delete('/:transactionId', function(req, res, next){
	if(req.params.transactionId) {
		var transactionInstance = new TransactionModel({});
		transactionInstance.delete(req.params.transactionId,function(err, response){
			console.log('delete callback...');
			if(err){
				res.status(500).json(err);
			} else{
				res.status(200).json(response);
			}
		});
	} else{
		res.status(400).json({error:'Invalid route- Please pass the transaction id'});
	}
});

module.exports = router;