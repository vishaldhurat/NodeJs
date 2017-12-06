/* jshint node: true */
/* jshint esnext: true */
'use strict'; //Grunt throws error: SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
var returnResponse = require('./response');
var utils = require('../helpers/utils.js');
/**
* Defines the User related operations.
* @class User
**/
class Rack {

    constructor(rack) {
        var self = this;
        self.response = {};
        self.response.data = {};
        //self.loggedInUserId = user.id;
        self.rack = rack;
    }

    /**
     * Get Rack by User id.
     * @function
     * @param {function} callback - callback function
    */
    getRack(callback){
        var self = this;
        var query = " SELECT * FROM `rack` INNER JOIN `book` ON `rack`.`book_id` = `book`.`book_id` ";
        
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
     * Search the Rack based on searchinfo.
     * @function
     * @param {function} callback - callback function
    */

    search(searchString, searchInfo, callback){
        var self = this;
        var query = " SELECT * FROM `rack` INNER JOIN `book` ON `rack`.`book_id` = `book`.`book_id` WHERE ";
        var parms = [];
        var wild = "%";

        if(searchInfo == "rack")  {
        	query = query + " `rack`.`rack_name` =  ? ";
        	parms = [searchString] ;
        }

        else if(searchInfo == "status")  {
        	query = query + " `rack`.`book_status` = ? ";
        	parms = [searchString] ;
        }

        else if(searchInfo == "name")  {
        	query = query + " `book`.`book_name` like ? ";
        	parms = wild + [searchString] + wild;
        }

        else if (searchInfo == "author") {
        	query = query + " `book`.`book_author` like ? ";
        	parms = wild + [searchString] + wild;
        }
		
		else if(searchInfo == "isbn") {
			query = query + " `book`.`book_isbn_no` like ? ";
        	parms = wild + [searchString] + wild;
		} 

		else if(searchInfo == "stream") {
			query = query + " `book`.`book_stream` like ? ";
        	parms = wild + [searchString] + wild;
		}

		else if(searchInfo == "edition") {
			query = query + " `book`.`book_edition` like ? ";
        	parms = wild + [searchString] + wild;
		}  

		else if(searchInfo == "publisher") {
			query = query + " `book`.`book_publisher` like ? ";
        	parms = wild + [searchString] + wild;
		}  
		
		GLOBAL.db.executePrepQuery(query, parms, function(err, result) {
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
     * Sort the Rack based on sortInfo.
     * @function
     * @param {function} callback - callback function
    */

    sort(sortInfo, callback){
        
        var self = this;
        var query = " SELECT * FROM `rack` INNER JOIN `book` ON `rack`.`book_id` = `book`.`book_id` ";
        
        if(sortInfo == "name")  {
        	query = query + " order by `book`.`book_name`"; 	
        }

        else if(sortInfo == "name DESC")  {
        	query = query + " order by `book`.`book_name` DESC "; 	
        }

        if (sortInfo == "author") {
        	query = query + "  order by `book`.`book_author` ";
        }
		
		else if (sortInfo == "author DESC") {
        	query = query + "  order by `book`.`book_author`  DESC ";
        }


		if(sortInfo == "isbn") {
			query = query + " order by `book`.`book_isbn_no`  ";
       	} 

       	else  if(sortInfo == "isbn DESC") {
			query = query + " order by `book`.`book_isbn_no` DESC ";
       	}

		if(sortInfo == "stream") {
			query = query + " order by `book`.`book_stream` ";
        }

        else if(sortInfo == "stream DESC") {
			query = query + " order by `book`.`book_stream` ";
        }

		if(sortInfo == "edition") {
			query = query + " order by `book`.`book_edition` ";
        }

        else if(sortInfo == "edition DESC") {
			query = query + " order by `book`.`book_edition` DESC ";
        }  

		if(sortInfo == "publisher") {
			query = query + " order by `book`.`book_publisher` ";
        }

        else if(sortInfo == "publisher DESC") {
			query = query + " order by `book`.`book_publisher` DESC ";
        }  

        GLOBAL.db.executeQuery(query, function(err, result) {
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
     * Add new Rack to the User
     * @function
     * @param {Object} data - Adress details .
     * @param {function} callback - callback function
    */
    save(data,  callback){
        console.log('add new Rack model:', data);
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
                    /** Instert data in  Rack */
                    function(waterfallCallback) {
                        self.createData(data, connection, function(err, rackId){
                            if(err){
                                waterfallCallback(err);
                                return;
                            }
                            data.rack_id = rackId;
                            waterfallCallback(null ,rackId);
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

    /**
     * update  rack by rack Id
     * @function
     * @param {Object} data - Rack details .
     * @param {function} callback - callback function
    */
    update(data, rackId, callback){
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
                        self.updateData(data,rackId,connection, function(err, rackId){
                            if(err){
                                waterfallCallback(err);
                                return;
                            }
                            waterfallCallback(null ,rackId);
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
      
        var self = this;
        var query = " INSERT INTO `heroku_862e36cb50be6ef`.`rack` (`rack_name`, `book_id`, `book_status`) VALUES (?,?,?) ";
        var inserts = [];
      
        if(data.rack_name){
            inserts.push(data.rack_name);
        } else{
            inserts.push(null);
        }

        if(data.book_id){
            inserts.push(data.book_id);
        } else{
            inserts.push(null);
        } 
        if(data.book_status) {
            inserts.push(data.book_status);
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
            callback(null,rows.insertId);
        });
    }

    updateData(data, rackId, connection,callback) {
        var self = this;
        var query = " UPDATE `heroku_862e36cb50be6ef`.`rack` SET `rack_name` = ?, `book_id` = ?, `book_status` = ? WHERE `rack_id` = '"+rackId+"' ";
        
         var update = [];
        if(data.rack_name){
            update.push(data.rack_name);
        } else{
            update.push(null);
        }

        if(data.book_id){
            update.push(data.book_id);
        } else{
            update.push(null);
        } 
        if(data.book_status) {
            update.push(data.book_status);
        }
        
        var formated_query = connection.query(query,update,function(err,rows){
            console.log('info', {task:"Query Executed", query: formated_query.sql});
            if(err) {
                console.log('error', formated_query.sql);
                console.log('error', err);
                callback(err);
                return;
            }
            callback(null,rackId);
        });
    }

    delete(rackId , callback) {
        var self = this;
        var query = "DELETE  from `heroku_862e36cb50be6ef`.`rack` WHERE `rack_id` = '" + rackId + "' ";
        
        GLOBAL.db.executeQuery(query, function(err, result){
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

module.exports = Rack;