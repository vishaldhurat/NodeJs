        var express = require('express');
var router = express.Router();
var book = require('../controllers/book.js');
var BookModel = require('../models/Book.js');

/**
 * @api {get} /api/book/:userId Get Book
 * @apiName GetBookDetails
 * @apiGroup BookDetails
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} book_id  id of Book.
 * @apiSuccess {Integer} user_id  id of User
 * @apiSuccess {String} book_name  book name.
 * @apiSuccess {String} book_author book author name.
 * @apiSuccess {String} book_isbn book isbn number.
 * @apiSuccess {String} book_stream book stream.
 * @apiSuccess {String} book_edition Book edition.
 * @apiSuccess {String} book_publisher book publisher .
 * @apiSuccess {String} book_image_path book image location.
 * @apiSuccess {BigDecimal} book_price book price.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * "data": {
 *   "result": [
 *     {
 *       "book_id": 2,
 *       "user_id": 1,
 *       "book_name": "DSC ASC ",
 *       "book_author": "Narshima",
 *       "book_isbn": "121sdsds",
 *       "book_stream": "MECH",
 *       "book_edition": "2nd",
 *       "book_publisher": "Crarenet",
 *       "book_image_path": "User/Image/location",
 *       "book_price": null,
 *       "first_name": "Pandit",
 *       "middle_name": "M",
 *       "last_name": "Biradar",
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
 * @apiError BookDetailsNotFound No Books found  for the user
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
 	var bookInstance = new BookModel(req.bookData);
   
	bookInstance.getBooks(function(err, transaction){
		if(err){
			res.status(500).json(err);
		} else {
			res.json(transaction);
		}
	});
	
});


router.get('/:userId', function(req, res, next) {
    if (req.params.userId) {
        var bookInstance = new BookModel(req.bookData);
        bookInstance.getUserBook(req.params.userId, function(err, book) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json(book);
            }
        });
    } else {
        res.status(400).json({
            error: 'Invalid route- Please pass the user id'
        });
    }
});

 


/**
 * @api {get} /api/book/:userId/id/:bookId Get Specified Book
 * @apiName GetBookDetailsbyID
 * @apiGroup BookDetails
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} book_id  id of Book.
 * @apiSuccess {Integer} user_id  id of User
 * @apiSuccess {String} book_name  book name.
 * @apiSuccess {String} book_author book author name.
 * @apiSuccess {String} book_isbn book isbn number.
 * @apiSuccess {String} book_stream book stream.
 * @apiSuccess {String} book_edition Book edition.
 * @apiSuccess {String} book_publisher book publisher .
 * @apiSuccess {String} book_image_path book image location.
 * @apiSuccess {BigDecimal} book_price book price.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * "data": {
 *   "result": [
 *     {
 *       "book_id": 2,
 *       "user_id": 1,
 *       "book_name": "DSC ASC ",
 *       "book_author": "Narshima",
 *       "book_isbn": "121sdsds",
 *       "book_stream": "MECH",
 *       "book_edition": "2nd",
 *       "book_publisher": "Crarenet",
 *       "book_image_path": "User/Image/location",
 *       "book_price": null,
 *       "first_name": "Pandit",
 *       "middle_name": "M",
 *       "last_name": "Biradar",
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
 * @apiError BookDetailsNotFound No Books found  for the user
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
router.get('/:userId/:bookId', function(req, res, next) {
    if (req.params.userId) {
        var bookInstance = new BookModel(req.bookData);
        bookInstance.getUserBookById(req.params.userId, req.params.bookId, function(err, book) {
            if (err) {
                res.status(500).json(err);
            } else {
                res.json(book);
            }
        });
    } else {
        res.status(400).json({
            error: 'Invalid route- Please pass the user  id'
        });
    }
});

/**
 * @api {post} /api/book/:userId/ New Book
 * @apiName  PostBookDetails
 * @apiGroup BookDetails
 * @apiVersion 0.1.0
 * @apiParam {Integer} book_id  id of Book.
 * @apiParam {Integer} user_id  id of User
 * @apiParam {String} book_name  book name.
 * @apiParam {String} book_author book author name.
 * @apiParam {String} book_isbn book isbn number.
 * @apiParam {String} book_stream book stream.
 * @apiParam {String} book_edition Book edition.
 * @apiParam {String} book_publisher book publisher .
 * @apiParam {String} book_image_path book image location.
 * @apiParam {BigDecimal} book_price book price.
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
 * 	@apiError BookDetailsAddError  HTTPCode: 500 Internale Server Error , 400 BAD Request
 */
router.post('/', function(req, res, next) {
    var bookInstance = new BookModel({});
    bookInstance.save(req, function(err, response) {
        console.log('Add new User callback...');
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(201).json(response);
        }
    });
});

/**
 * @api {put} /api/address/:userId/id/:bookId Edit Book
 * @apiName PutBookDetails
 * @apiGroup BookDetails
 * @apiVersion 0.1.0
 * @apiParam {Integer} book_id  id of Book.
 * @apiParam {Integer} user_id  id of User
 * @apiParam {String} book_name  book name.
 * @apiParam {String} book_author book author name.
 * @apiParam {String} book_isbn book isbn number.
 * @apiParam {String} book_stream book stream.
 * @apiParam {String} book_edition Book edition.
 * @apiParam {String} book_publisher book publisher .
 * @apiParam {String} book_image_path book image location.
 * @apiParam {BigDecimal} book_price book price.
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
 * @apiError BookDetailsEditError  HTTPCode: 500 Internale Server Error , 400 BAD Request
 */
router.put('/:userId/id/:bookId', function(req, res, next) {
    if (req.params.bookId) {
        var bookInstance = new BookModel({});
        bookInstance.update(req.params.userId, req.body, req.params.bookId, function(err, response) {
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
 * @api {delete} /api/book/:userId/id/:bookId  Delete Book
 * @apiName DeleteBookDetails
 * @apiGroup BookDetails
 * @apiVersion 0.1.0
 * @apiSuccess {Integer} book_id  id of Book.
 * @apiSuccess {Integer} user_id  id of User
 * @apiSuccess {String} book_name  book name.
 * @apiSuccess {String} book_author book author name.
 * @apiSuccess {String} book_isbn book isbn number.
 * @apiSuccess {String} book_stream book stream.
 * @apiSuccess {String} book_edition Book edition.
 * @apiSuccess {String} book_publisher book publisher .
 * @apiSuccess {String} book_image_path book image location.
 * @apiSuccess {BigDecimal} book_price book price.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 203 OK
 * @apiError BookDetailsDeleteError Invalid route- Please pass the user id
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



 //router.delete('/:userId/id/:bookId', function(req, res, next) {

 router.delete('/:userId/:bookId', function(req, res, next) {
    if (req.params.bookId) {
        var bookInstance = new BookModel({});
        bookInstance.delete(req.params.userId, req.params.bookId, function(err, response) {
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
