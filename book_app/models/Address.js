/* jshint node: true */
/* jshint esnext: true */
'use strict'; //Grunt throws error: SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
var returnResponse = require('./response');
var utils = require('../helpers/utils.js');
/**
* Defines the User related operations.
* @class User
**/
class Address {

    constructor(address) {
        var self = this;
        self.response = {};
        self.response.data = {};
        //self.loggedInUserId = user.id;
        self.adress = address;
    }

    /**
     * Get Address by User id.
     * @function
     * @param {string} userId - User Id
     * @param {function} callback - callback function
    */
    getUserAdress(userId, callback){
        var self = this;
        console.log('user id:', userId);

        //var query = "SELECT * from User WHERE user_id = "+userId;
         var query = "SELECT * FROM `user_address` INNER JOIN `user` ON `user_address`.`user_id` = `user`.`user_id` AND `user_address`.`user_id` = '"+userId+"'";
        //GLOBAL.db.mysql.format(query, [userId]);
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
     * Get User Address by address Id and User Id.
     * @function
     * @param {function} callback - callback function
    */
    getUserAdressById(userId, addressId, callback){
        var self = this;
        var query = "SELECT * FROM `user_address` INNER JOIN `user` ON `user_address`.`user_id` = `user`.`user_id` AND `user_address`.`user_id` = '"+userId+"' AND  `user_address`.`address_id` = '"+addressId+"'";
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
     * Add new Address to the User
     * @function
     * @param {Object} data - Adress details .
     * @param {function} callback - callback function
    */
    save(userId, data,  callback){
        console.log('add new Address model:', data);
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
                    /** Instert data in User Address */
                    function(waterfallCallback) {
                        self.createData(userId,data, connection, function(err, addressId){
                            if(err){
                                waterfallCallback(err);
                                return;
                            }
                            data.address_id = addressId;
                            waterfallCallback(null ,addressId);
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
     * update  User
     * @function
     * @param {Object} data - User details for registaration.
     * @param {function} callback - callback function
    */
    update(userId, data, addressId, callback){
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
                        self.updateData(userId,data, addressId,connection, function(err, addressId){
                            if(err){
                                waterfallCallback(err);
                                return;
                            }
                            waterfallCallback(null ,addressId);
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
     * Creates a new User in to system.
     * @function
     * @param {Object} data - User details for registaration.
     * @param {function} callback - callback function
    */
    createData(userId,data, connection, callback){
       // console.log('createUsers:', data);
        var self = this;
        //var query = "INSERT INTO `cafe-laundry`.`users` (`users_first_name`, `users_middle_name`, `users_last_name`, `users_building_name`, `users_street_name`, `user_area_name`, `user_pincode`, `user_landmark`) VALUES (?,?,?,?,?,?,?,?)";
        var query = "INSERT INTO `heroku_862e36cb50be6ef`.`user_address` (`user_id`, `house_no`, `street`, `landmark`, `Area`, `city`, `pincode`, `state`) VALUES (?,?,?,?,?,?,?,?)";
        var inserts = [userId];
        if(data.house_no){
            inserts.push(data.house_no);
        } else{
            inserts.push(null);
        }

        if(data.street){
            inserts.push(data.street);
        } else{
            inserts.push(null);
        } 
        if(data.landmark) {
            inserts.push(data.landmark);
        } else {
            inserts.push(null);
        }
        if(data.Area) {
             inserts.push(data.Area);
        } else {
            inserts.push(null);
        } 
        if(data.city) {
            inserts.push(data.city);
        } else {
            inserts.push(null);
        }
        if(data.pincode) {
            inserts.push(data.pincode);
        } else {
            inserts.push(null);
        }
        if(data.state) {
            inserts.push(data.state);
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

    updateData(userId, data, addressId, connection,callback) {
        var self = this;
        var query = "UPDATE `heroku_862e36cb50be6ef`.`user_address` SET `house_no` = ?, `street` = ?, `landmark` = ?, `Area` = ?, `city` = ?, `pincode` = ?, `state` = ? WHERE `user_id` = '"+userId+"' AND address_id ='"+addressId+"'";
        
         var update = [];
        if(data.house_no){
            update.push(data.house_no);
        } else{
            update.push(null);
        }

        if(data.street){
            update.push(data.street);
        } else{
            update.push(null);
        } 
        if(data.landmark) {
            update.push(data.landmark);
        }
        if(data.Area) {
             update.push(data.Area);
        } else {
            update.push(null);
        } 
        if(data.city) {
            update.push(data.city);
        } else {
            update.push(null);
        }
        if(data.pincode) {
            update.push(data.pincode);
        } else {
            update.push(null);
        }
        if(data.state) {
            update.push(data.state);
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
            callback(null,userId);
        });
    }

    delete(userId,addressId , callback) {
        var self = this;
        var query = "DELETE  from `heroku_862e36cb50be6ef`.`user_address` WHERE `user_id` = '" + userId + "' AND address_id = '"+addressId+"' ";
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

module.exports = Address;