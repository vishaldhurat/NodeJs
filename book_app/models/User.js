/* jshint node: true */
/* jshint esnext: true */
'use strict'; //Grunt throws error: SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
var returnResponse = require('./response');
var utils = require('../helpers/utils.js');
/**
 * Defines the User related operations.
 * @class User
 **/
class User {

    constructor(user) {
        var self = this;
        self.response = {};
        self.response.data = {};
        //self.loggedInUserId = user.id;
        self.user = user;
    }

    /**
     * Get User by User id.
     * @function
     * @param {string} userId - User Id
     * @param {function} callback - callback function
     */
    getUserById(userId, callback) {
        var self = this;
        var query = "SELECT * from User WHERE user_id = '" + userId + "'";
        //GLOBAL.db.mysql.format(query, [userId]);
        GLOBAL.db.executeQuery(query, function(err, result) {
            if (err) {
                returnResponse.errorMessage(self, err, GLOBAL.config.default_error_code, callback);
                return;
            }
            self.response.data.result = JSON.parse(JSON.stringify(result));
            returnResponse.successMessage(self, GLOBAL.config.default_success_message, GLOBAL.config.default_success_code, callback);
        });
    }

    /**
     * Get All users.
     * @function
     * @param {function} callback - callback function
     */
    getUsers(callback) {
        var self = this;
        var query = "SELECT * from User";
        GLOBAL.db.executeQuery(query, function(err, result) {
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
     * Register new User
     * @function
     * @param {Object} data - User details for registaration.
     * @param {function} callback - callback function
     */
    register(data, callback) {
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
                        self.createUser(data, connection, function(err, userId) {
                            if (err) {
                                waterfallCallback(err);
                                return;
                            }
                            data.user_id = userId;
                            waterfallCallback(null, userId);
                        });
                    },
                    /** Insert data in login */
                    function(userId, waterfallCallback) {
                        self.createLogin(data, connection, function(err, loginId) {
                            if (err) {
                                waterfallCallback(err);
                                return;
                            }
                            waterfallCallback(null, loginId);
                        });
                    }
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
     * update  User
     * @function
     * @param {Object} data - User details for registaration.
     * @param {function} callback - callback function
     */
    update(data, userId, callback) {
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
                        self.updateUser(data, userId, connection, function(err, userId) {
                            if (err) {
                                waterfallCallback(err);
                                return;
                            }
                            waterfallCallback(null, userId);
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


    /**
     * Creates a new User in to system.
     * @function
     * @param {Object} data - User details for registaration.
     * @param {function} callback - callback function
     */
    createUser(data, connection, callback) {
        var self = this;
        var query = "INSERT INTO `heroku_862e36cb50be6ef`.`user` (`first_name`, `middle_name`, `last_name`, `institute_id`) VALUES (?,?,?,?)";
        //var query = "INSERT INTO `heroku_862e36cb50be6ef`.`user` (`first_name`, `middle_name`, `last_name`) VALUES (?,?,?)";
        var inserts = [data.firstName];
        console.log('data:', data);
        if (data.middleName) {
            inserts.push(data.middleName);
        } else {
            inserts.push(null);
        }

        if (data.lastName) {
            inserts.push(data.lastName);
        } else {
            inserts.push(null);
        }
        if (data.instituteId) {
            inserts.push(data.instituteId);
        } else {
            inserts.push(null);
        }
        query = GLOBAL.mysql.format(query, inserts);
        console.log('query:', query);
        connection.query(query, inserts, function(err, rows) {
            console.log('info', {
                task: "Query Executed",
                query: query
            });
            if (err) {
                console.log('error', query);
                console.log('error', err);
                return callback(err);
            }
            callback(null, rows.insertId);
        });
    }

    updateUser(data, userId, connection, callback) {
        var self = this;
        var query = "UPDATE `heroku_862e36cb50be6ef`.`user` SET `first_name`= ?, `middle_name` = ?, `last_name` = ?, `institute_id` = ?,  `mobile_no` = ?, `email_id` = ? WHERE `user_id` = '" + userId + "'";

        var update = [data.firstName];
        if (data.middleName) {
            update.push(data.middleName);
        } else {
            update.push(null);
        }

        if (data.lastName) {
            update.push(data.lastName);
        } else {
            update.push(null);
        }
        if (data.instituteId) {
            update.push(data.instituteId);
        } else {
            update.push(null);
        }
        if (data.mobile) {
            update.push(data.mobile);
        } else {
            update.push(null);
        }
        if (data.emailId) {
            update.push(data.emailId);
        } else {
            update.push(null);
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

    delete(userId, callback) {
        var self = this;
        var query = "DELETE  from `heroku_862e36cb50be6ef`.`user` WHERE `user_id` = '" + userId + "'";
        GLOBAL.db.executeQuery(query, function(err, result) {
            if (err) {
                returnResponse.errorMessage(self, err, GLOBAL.config.default_error_code, callback);
                return;
            }
            self.response.data.result = JSON.parse(JSON.stringify(result));
            returnResponse.successMessage(self, GLOBAL.config.default_success_message, GLOBAL.config.default_success_code, callback);
        });
    }

    createLogin(loginDetails, connection, callback) {
        //https://crackstation.net/hashing-security.htm
        var self = this;
        var utilsObject = new utils();
        var salt = utilsObject.genRandomString(GLOBAL.config.login_salt_length); /**gets a random 10 char string */
        var passwordHash = utilsObject.sha512(loginDetails.password, salt); /** returns an object with the hashed pwd and salt*/
        var unlockedPwd = utilsObject.sha512(loginDetails.password, salt).passwordHash;
        var query = "INSERT INTO `login` (`user_id`, `login_email`, `login_mobile`, `login_passkey`, `login_salt`) VALUES (?,?,?,?,?)";
        var inserts = [loginDetails.user_id, loginDetails.emailId, loginDetails.mobile, passwordHash.passwordHash, passwordHash.salt];
        query = GLOBAL.mysql.format(query, inserts);
        console.log('login query:', query);
        GLOBAL.db.getRecords(connection, query, function(err, rows) {
            if (err) {
                console.log('error', err);
                return callback(err);
            }
            callback(null, rows.insertId);
        });
    }
}

module.exports = User;
