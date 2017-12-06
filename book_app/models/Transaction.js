/* jshint node: true */
/* jshint esnext: true */
'use strict'; //Grunt throws error: SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
var returnResponse = require('./response');
var utils = require('../helpers/utils.js');
/**
* Defines the User related operations.
* @class User
**/
class Transaction {

    constructor(book) {
        var self = this;
        self.response = {};
        self.response.data = {};
        //self.loggedInUserId = user.id;
        self.book = book;
    }

    /**
     * Get Transaction details.
     * @function
     * @param {string} userId - User Id
     * @param {function} callback - callback function
    */
    getTransaction(callback){
       
        var self = this;
        
        //var query = " SELECT * FROM `heroku_862e36cb50be6ef`.`transaction` ";
        var query = "SELECT * FROM `heroku_862e36cb50be6ef`.`transaction` trans  INNER JOIN `heroku_862e36cb50be6ef`.`book` book ON trans.book_id = book.book_id";
         
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
     * Get User Transaction by Transaction Id .
     * @function
     * @param {function} callback - callback function
    */
    getTransactionId(transactionId, callback){
        var self = this;
        //var query = " SELECT * FROM `heroku_862e36cb50be6ef`.`transaction`  where transaction_id = ? ";

        var query = " SELECT * FROM `heroku_862e36cb50be6ef`.`transaction` trans  INNER JOIN `heroku_862e36cb50be6ef`.`Book` books ON trans.book_id= Books.book_id INNER JOIN   `heroku_862e36cb50be6ef`.`user` users ON trans.saler_user_id = users.user_id where trans.transaction_id = ? ";

        var params = [transactionId];
        GLOBAL.db.executePrepQuery(query, params,function(err, result) {
            if(err) {
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
     * Get Transaction details by userType.
     * @function
     * @param {string} userId - User Id
     * @param {function} callback - callback function
    */
    getTransactionByUser(userId, userType, callback){
        var self = this;
        var params = [];

        var query = " SELECT * FROM `heroku_862e36cb50be6ef`.`transaction` trans INNER JOIN `heroku_862e36cb50be6ef`.`book` book where trans.book_id = book.book_id ";

        if(userType == 'buy') {
        	query = query + " AND trans.`buyer_user_id` = ? " ;
        	params = userId;
        } 
        else if (userType == 'sale')  {
        	query = query + " AND trans.`saler_user_id` = ? ";
        	params = userId;
        }
        console.log(query);
        GLOBAL.db.executePrepQuery(query,params, function(err, result) {
            if(err) {
                returnResponse.errorMessage(self, err, GLOBAL.config.default_error_code, callback);
                return;
            }
            self.response.data.result = JSON.parse(JSON.stringify(result));
            returnResponse.successMessage(self, GLOBAL.config.default_success_message, GLOBAL.config.default_success_code, callback);
        });
    }

    /**
     * Add new Transaction 
     * @function
     * @param {Object} data - Adress details .
     * @param {function} callback - callback function
    */
    save(data,  callback){
        console.log('add new Transaction model:', data);
        var self = this;
        var errorObject = {
            error:false,
            message:null
        };
        
        GLOBAL.db.createTransaction(GLOBAL.SQLpool, function(err,connection){
            if(err){
                console.log('connection err:', err);
                callback(err);
                //winston.log('error', err);
                return;
            }
            //console.log('Get transaction connection:', connection);
            GLOBAL.async.waterfall(
                [
                    /** Instert data in User Transaction */
                    function(waterfallCallback) {
                        self.createData(data, connection, function(err, TransactionId){
                            if(err){
                                waterfallCallback(err);
                                return;
                            }
                            data.transaction_id = TransactionId;
                            waterfallCallback(null ,TransactionId);
                        });
                    },
                ],
                //TODO:Setup OTP for mobile no confirmation. Then check status.
                function(err, result) { 
                    if(err){
                        connection.rollback(function() {
                            console.log('error', {task:"Rollbacked", error: err});
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
                                console.log('error while commit ', {task:"Rollbacked", error: err});
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
            );//async close
        });
    }

    /**
     * update  institution by User Id and Inst Id
     * @function
     * @param {Object} data - User details for registaration.
     * @param {function} callback - callback function
    */
    update(data, transactionId, callback){
        console.log('register model:', data);
        var self = this;
        var errorObject = {
            error:false,
            message:null
        };
        
        GLOBAL.db.createTransaction(GLOBAL.SQLpool, function(err,connection){
            if(err){
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
                        self.updateData(data, transactionId,connection, function(err, transactionId){
                            if(err){
                                waterfallCallback(err);
                                return;
                            }
                            waterfallCallback(null ,transactionId);
                        });
                    },
                ],
               
                function(err, result) { 
                    if(err){
                        connection.rollback(function() {
                            console.log('error', {task:"Rollbacked", error: err});
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
                                console.log('error while commit ', {task:"Rollbacked", error: err});
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
            );//async close
        });
    }


    createData(data, connection, callback){
      console.log(data);
        var self = this;
        var query = " INSERT INTO `heroku_862e36cb50be6ef`.`transaction` (`book_id`, `saler_user_id`, `buyer_user_id`, `status`) " 
        			+ " VALUES (?,?,?,?) ";
        
        var inserts = [];
      
        if(data.book_id){
            inserts.push(data.book_id);
        } else{
            inserts.push(null);
        } 
        if(data.saler_user_id) {
            inserts.push(data.saler_user_id);
        } else {
            inserts.push(null);
        }
        if(data.buyer_user_id) {
             inserts.push(data.buyer_user_id);
        } else {
            inserts.push(null);
        } 
        if(data.status) {
             inserts.push(data.status);
        } else {
            inserts.push(null);
        } 
        
         var formated_query = connection.query(query,inserts,function(err,rows){
            console.log('info', {task:"Query Executed", query: formated_query.sql});
            if(err) {
                console.log('error', formated_query.sql);
                console.log('error', err);
                callback(err);
                return;
            }
            //update book status ib book table
          var  $query1 = "UPDATE `heroku_862e36cb50be6ef`.`book` SET book_status='Sold' WHERE book_id="+data.book_id;
            connection.query($query1);
            callback(null,rows.insertId);
        });
    }

    updateData(data, transactionId, connection,callback) {
        var self = this;
        //var query = "UPDATE `heroku_862e36cb50be6ef`.`transaction` SET  `book_id` = ?, `saler_user_id` = ?, `buyer_user_id` = ? , `status` = ?  WHERE `transaction_id` ='"+transactionId+"'";
      var query = "UPDATE `heroku_862e36cb50be6ef`.`transaction` SET  `buyer_user_id` = ? , `status` = ?  WHERE `transaction_id` ='"+transactionId+"'";

         var update = [];
        if(data.book_id){
            update.push(data.book_id);
        } else{
            //update.push(null);
        }

        if(data.saler_user_id){
            update.push(data.saler_user_id);
        } else{
            //update.push(null);
        } 
        if(data.buyer_user_id) {
            update.push(data.buyer_user_id);
        }
        if(data.status) {
             update.push(data.status);
        } else {
            update.push(null);
        }
        
        var formated_query = connection.query(query,update,function(err,rows){
            console.log('info', {task:"Query Executed", query: formated_query.sql});
            if(err) {
                console.log('error', formated_query.sql);
                console.log('error', err);
                callback(err);
                return;
            }
            callback(null,transactionId);
        });
    }

    delete(transactionId, callback) {
        var self = this;
        var query = "DELETE  from `heroku_862e36cb50be6ef`.`transaction` WHERE `transaction_id` = ? ";
        var params = [transactionId];
        
        GLOBAL.db.executePrepQuery(query, params,function(err, result){
            if(err) {
                returnResponse.errorMessage(self, err, GLOBAL.config.default_error_code, callback);
                return;
            }
            self.response.data.result = JSON.parse(JSON.stringify(result));
            //console.log('result:', result);
            returnResponse.successMessage(self, GLOBAL.config.default_success_message, GLOBAL.config.default_success_code, callback);
        });
    }
}

module.exports = Transaction;