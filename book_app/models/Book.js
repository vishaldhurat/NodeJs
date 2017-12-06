/* jshint node: true */
/* jshint esnext: true */
'use strict'; //Grunt throws error: SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
var returnResponse = require('./response');
var utils = require('../helpers/utils.js');
/**
 * Defines the User related operations.
 * @class User
 **/
class Book {

    constructor(book) {
        var self = this;
        self.response = {};
        self.response.data = {};
        //self.loggedInUserId = user.id;
        self.book = book;
    }

    
  
    getBooks(callback){
       
        var self = this;
        var query = " SELECT * FROM `heroku_862e36cb50be6ef`.`book` where book_status='onSale' ";
        GLOBAL.db.executeQuery(query,function(err, result) {
            if(err) {
                returnResponse.errorMessage(self, err, GLOBAL.config.default_error_code, callback);
                return;
            }
            self.response.data.result = JSON.parse(JSON.stringify(result));
            returnResponse.successMessage(self, GLOBAL.config.default_success_message, GLOBAL.config.default_success_code, callback);
         });
    }
    
    
    /**
     * Get Book by User id.
     * @function
     * @param {string} userId - User Id
     * @param {function} callback - callback function
     */
    getUserBook(userId, callback) {
        var self = this;
        console.log('user id:', userId); //var query = "SELECT * from User WHERE user_id = "+userId;
        var query = "SELECT * FROM `book` INNER JOIN `user` ON `book`.`user_id` = `user`.`user_id` AND `book`.`user_id` = ? AND  `book`.book_status='onSale' ";

        //GLOBAL.db.mysql.format(query, [userId]);
        GLOBAL.db.executePrepQuery(query, [userId], function(err, result) {

            if (err) {
                returnResponse.errorMessage(self, err, GLOBAL.config.default_error_code, callback);
                return;
            }
            self.response.data.result = JSON.parse(JSON.stringify(result));
            returnResponse.successMessage(self, GLOBAL.config.default_success_message, GLOBAL.config.default_success_code, callback);
        });
    }

   /**
     * Get User Book by Book Id and User Id.
     * @function
     * @param {function} callback - callback function
     */
    getUserBookById(userId, bookId, callback) {
        var self = this;
        var query = "SELECT * FROM `book` INNER JOIN `user` ON `book`.`user_id` = `user`.`user_id` AND `book`.`user_id` = ? AND  `book`.`book_id` = ? ";
        var params = [userId, bookId];
        GLOBAL.db.executePrepQuery(query, params, function(err, result) {
            if (err) {
                //callback(err, null);
                returnResponse.errorMessage(self, err, GLOBAL.config.default_error_code, callback);
                return;
            }
            //callback(null, result);
            self.response.data.result = JSON.parse(JSON.stringify(result));
            //console.log('result:', result);
            returnResponse.successMessage(self, GLOBAL.config.default_success_message, GLOBAL.config.default_success_code, callback);
        });
    }



    /**
     * Add new Book to the User
     * @function
     * @param {Object} data - Adress details .
     * @param {function} callback - callback function
     */
    save(req, callback) {
        console.log('add new Book model:', req.body);
        var self = this;
        var errorObject = {
            error: false,
            message: null
        };

        GLOBAL.db.createTransaction(GLOBAL.SQLpool, function(err, connection) {
            if (err) {
                console.log('connection err:', err);
                callback(err);
                //winston.log('error', err);
                return;
            }
            //console.log('Get transaction connection:', connection);
            GLOBAL.async.waterfall(
                [
                    /** Instert data in User Book */
                    function(waterfallCallback) {
                        self.createData(req, connection, function(err, BookId) {
                            if (err) {
                                waterfallCallback(err);
                                return;
                            }
                            req.body.Book_id = BookId;
                            waterfallCallback(null, BookId);
                        });
                    },
                    //TODO: Insert rack
                ],
                //TODO:Setup OTP for mobile no confirmation. Then check status.
                function(err, result) {
                    if (err) {
                        connection.rollback(function() {
                            console.log('error', {
                                task: "Rollbacked",
                                error: err
                            });
                            errorObject.error = true;
                            errorObject.message = err;
                            returnResponse.errorMessage(self, errorObject, GLOBAL.config.default_error_code, callback);
                            connection.release();
                        });
                        return;
                    }
                    connection.commit(function(err) {
                        if (err) {
                            connection.rollback(function() {
                                console.log('error while commit ', {
                                    task: "Rollbacked",
                                    error: err
                                });
                                errorObject.error = true;
                                errorObject.message = err;
                                returnResponse.errorMessage(self, errorObject, GLOBAL.config.default_error_code, callback);
                                connection.release();
                            });
                            return;
                        }
                        connection.release();
                        self.response.data.result = JSON.parse(JSON.stringify(result));
                        return returnResponse.successMessage(self, GLOBAL.config.default_success_message, GLOBAL.config.default_success_code, callback);
                    });
                }
            ); //async close
        });
    }

    /**
     * update  institution by User Id and Inst Id
     * @function
     * @param {Object} data - User details for registaration.
     * @param {function} callback - callback function
     */
    update(userId, data, bookId, callback) {
        console.log('register model:', data);
        var self = this;
        var errorObject = {
            error: false,
            message: null
        };

        GLOBAL.db.createTransaction(GLOBAL.SQLpool, function(err, connection) {
            if (err) {
                console.log('connection err:', err);
                callback(err);
                //winston.log('error', err);
                return;
            }
            //console.log('Get transaction connection:', connection);
            GLOBAL.async.waterfall(
                [
                    /** Instert data in Users */
                    function(waterfallCallback) {
                        self.updateData(userId, data, bookId, connection, function(err, bookId) {
                            if (err) {
                                waterfallCallback(err);
                                return;
                            }
                            waterfallCallback(null, bookId);
                        });
                    },
                ],

                function(err, result) {
                    if (err) {
                        connection.rollback(function() {
                            console.log('error', {
                                task: "Rollbacked",
                                error: err
                            });
                            errorObject.error = true;
                            errorObject.message = err;
                            returnResponse.errorMessage(self, errorObject, GLOBAL.config.default_error_code, callback);
                            connection.release();
                        });
                        return;
                    }
                    connection.commit(function(err) {
                        if (err) {
                            connection.rollback(function() {
                                console.log('error while commit ', {
                                    task: "Rollbacked",
                                    error: err
                                });
                                errorObject.error = true;
                                errorObject.message = err;
                                returnResponse.errorMessage(self, errorObject, GLOBAL.config.default_error_code, callback);
                                connection.release();
                            });
                            return;
                        }
                        connection.release();
                        self.response.data.result = JSON.parse(JSON.stringify(result));
                        return returnResponse.successMessage(self, GLOBAL.config.default_success_message, GLOBAL.config.default_success_code, callback);
                    });
                }
            ); //async close
        });
    }


    createData(req, connection, callback) {

        var self = this;
        var data = req.body;
        //var userId = req.userData;
        var userId=data.user_id;
        var query = " INSERT INTO `heroku_862e36cb50be6ef`.`book` (`user_id`, `book_name`, `book_author`, `book_isbn_no`, `book_stream`,  `book_edition`,  `book_publisher`,  `book_image_path`,  `book_price`,`book_semester`) VALUES (?,?,?,?,?,?,?,?,?, ?) ";

        
        
        var inserts = [userId];

//        if (data.user_id) {
//            inserts.push(data.user_id);
//        } else {
//            inserts.push(null);
//        }
        
        
        if (data.book_name) {
            inserts.push(data.book_name);
        } else {
            inserts.push(null);
        }

        if (data.book_author) {
            inserts.push(data.book_author);
        } else {
            inserts.push(null);
        }
        if (data.book_isbn_no) {
            inserts.push(data.book_isbn_no);
        } else {
            inserts.push(null);
        }
        if (data.book_stream) {
            inserts.push(data.book_stream);
        } else {
            inserts.push(null);
        }
        if (data.book_edition) {
            inserts.push(data.book_edition);
        } else {
            inserts.push(null);
        }
        if (data.book_publisher) {
            inserts.push(data.book_publisher);
        } else {
            inserts.push(null);
        }
        if (data.book_image_path) {
            inserts.push(data.book_image_path);
        } else {
            inserts.push(null);
        }
        if (data.book_price) {
            inserts.push(data.book_price);
        } else {
            inserts.push(null);
        }
        if (data.book_semester) {
            inserts.push(data.book_semester);
        } else {
            inserts.push(null);
        }

        var formated_query = connection.query(query, inserts, function(err, rows) {
            console.log('info', {
                task: "Query Executed",
                query: formated_query.sql
            });
            if (err) {
                console.log('error', formated_query.sql);
                console.log('error', err);
                callback(err);
                return;
            }
            callback(null, rows.insertId);
        });
    }

    updateData(userId, data, bookId, connection, callback) {
        var self = this;
        var query = "UPDATE `heroku_862e36cb50be6ef`.`book` SET  `book_name` = ?, `book_author` = ?, `book_isbn_no` = ? , `book_stream` = ?,  `book_edition` = ?,  `book_publisher` = ?,  `book_image_path` = ?,  `book_price` = ?, `book_semester` = ?  WHERE `user_id` = '" + userId + "' AND `book_id` ='" + bookId + "'";

        var update = [];
        if (data.book_name) {
            update.push(data.book_name);
        } else {
            update.push(null);
        }

        if (data.book_author) {
            update.push(data.book_author);
        } else {
            update.push(null);
        }
        if (data.book_isbn_no) {
            update.push(data.book_isbn_no);
        }
        if (data.book_stream) {
            update.push(data.book_stream);
        } else {
            update.push(null);
        }
        if (data.book_edition) {
            update.push(data.book_edition);
        } else {
            update.push(null);
        }
        if (data.book_publisher) {
            update.push(data.book_publisher);
        } else {
            update.push(null);
        }
        if (data.book_image_path) {
            update.push(data.book_image_path);
        } else {
            update.push(null);
        }
        if (data.book_price) {
            update.push(data.book_price);
        } else {
            update.push(null);
        }

        if (data.book_semester) {
            inserts.push(data.book_semester);
        } else {
            inserts.push(null);
        }

        var formated_query = connection.query(query, update, function(err, rows) {
            console.log('info', {
                task: "Query Executed",
                query: formated_query.sql
            });
            if (err) {
                console.log('error', formated_query.sql);
                console.log('error', err);
                callback(err);
                return;
            }
            callback(null, userId);
        });
    }

    delete(userId, bookId, callback) {
        var self = this;
        var query = "DELETE  from `heroku_862e36cb50be6ef`.`book` WHERE `user_id` = ? AND `book_id` = ? ";
        var params = [userId, bookId];
        GLOBAL.db.executePrepQuery(query, params, function(err, result) {
            if (err) {
                returnResponse.errorMessage(self, err, GLOBAL.config.default_error_code, callback);
                return;
            }
            self.response.data.result = JSON.parse(JSON.stringify(result));
            console.log('result:', result);
            returnResponse.successMessage(self, GLOBAL.config.default_success_message, GLOBAL.config.default_success_code, callback);
        });
    }
}

module.exports = Book;
