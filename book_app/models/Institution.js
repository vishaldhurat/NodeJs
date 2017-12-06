/* jshint node: true */
/* jshint esnext: true */
'use strict'; //Grunt throws error: SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
var returnResponse = require('./response');
var utils = require('../helpers/utils.js');
/**
* Defines the User related operations.
* @class User
**/
class Institution {

    constructor(institution) {
        var self = this;
        self.response = {};
        self.response.data = {};
        //self.loggedInUserId = user.id;
        self.institution = institution;
    }

    /**
     * Get Institution by User id.
     * @function
     * @param {string} userId - User Id
     * @param {function} callback - callback function
    */
    getUserInst(userId, callback){
        var self = this;
        console.log('user id:', userId);

        //var query = "SELECT * from User WHERE user_id = "+userId;
         var query = "SELECT * FROM `institution_info` INNER JOIN `user` ON `institution_info`.`user_id` = `user`.`user_id` AND `institution_info`.`user_id` = '"+userId+"'";
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
     * Get User Institution by Institution Id and User Id.
     * @function
     * @param {function} callback - callback function
    */
    getUserInstById(userId, instId, callback){
        var self = this;
        var query = "SELECT * FROM `institution_info` INNER JOIN `user` ON `institution_info`.`user_id` = `user`.`user_id` AND `institution_info`.`user_id` = '"+userId+"' AND  `institution_info`.`institution_info_id` = '"+instId+"'";
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
     * Add new Institution to the User
     * @function
     * @param {Object} data - Adress details .
     * @param {function} callback - callback function
    */
    save(userId, data,  callback){
        console.log('add new Institution model:', data);
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
                    /** Instert data in User Institution */
                    function(waterfallCallback) {
                        self.createData(userId,data, connection, function(err, InstitutionId){
                            if(err){
                                waterfallCallback(err);
                                return;
                            }
                            data.Institution_id = InstitutionId;
                            waterfallCallback(null ,InstitutionId);
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
    update(userId, data, instId, callback){
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
                        self.updateData(userId,data, instId,connection, function(err, instId){
                            if(err){
                                waterfallCallback(err);
                                return;
                            }
                            waterfallCallback(null ,instId);
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


    createData(userId,data, connection, callback){
        var self = this;
        var query = "INSERT INTO `heroku_862e36cb50be6ef`.`institution_info` (`user_id`, `name`, `university`, `semester`,`state`, `country`) VALUES (?,?,?,?,?,?)";
        var inserts = [userId];
      
        if(data.name){
            inserts.push(data.name);
        } else{
            inserts.push(null);
        }

        if(data.university){
            inserts.push(data.university);
        } else{
            inserts.push(null);
        } 
         if(data.semester){
            inserts.push(data.semester);
        } else{
            inserts.push(null);
        } 
        if(data.state) {
            inserts.push(data.state);
        } else {
            inserts.push(null);
        }
        if(data.country) {
             inserts.push(data.country);
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

    updateData(userId, data, instId, connection,callback) {
        var self = this;
        var query = "UPDATE `heroku_862e36cb50be6ef`.`institution_info` SET `name` = ?, `university` = ?, `semester` = ?, `state` = ?, `country` = ? WHERE `user_id` = '"+userId+"' AND `institution_info_id` ='"+instId+"'";
        
         var update = [];
        if(data.name){
            update.push(data.name);
        } else{
            update.push(null);
        }

        if(data.university){
            update.push(data.university);
        } else{
            update.push(null);
        } 

        if(data.semester){
            update.push(data.semester);
        } else{
            update.push(null);
        } 
        
        if(data.state) {
            update.push(data.state);
        }
        if(data.country) {
             update.push(data.country);
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

    delete(userId,instId , callback) {
        var self = this;
        var query = "DELETE  from `heroku_862e36cb50be6ef`.`institution_info` WHERE `user_id` = '" + userId + "' AND `institution_info_id` = '"+instId+"'";
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

module.exports = Institution;