/* jshint node: true */
/* jshint esnext: true */
'use strict';
var utils = require('../helpers/utils.js');
class Auth {
    constructor(user) {
        console.log('user:', user);
    }

    login(loginDetails, callback) {
        var self = this;
        GLOBAL.async.waterfall(
            [
                function(callback) {
                    console.log('info', 'Login API - validate login');
                    self.validateUser(loginDetails, function(err, loginData) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, loginData);
                    });
                },
                //Update last login information
                function(loginData, callback) {
                    console.log('info', 'Login API - update last login of the user');
                    self.updateLastLoginTime(loginData, function(err) {
                        if (err) {
                            return callback(err);
                        }
                        callback(null, loginData);
                    });
                }
            ],
            function(err, loginData) {
                if (err) {
                    callback(err);
                } else {
                    //console.log('Final callback:', loginData);
                    callback(null, loginData);
                }
            }
        );
    }

    //Prototype
    validateUser(data, callback) {
        var self = this;
        //Table changes depending on the user type and store dynamically.
        var query = "SELECT * FROM `login` INNER JOIN `user` ON `login`.`user_id` = `user`.`user_id` AND `login`.`login_email` = '" + data.email + "' AND `user`.`user_status` = 'ACTIVE'";
        GLOBAL.db.executeQuery(query, function(err, rows) {
            if (err) {
                return callback(err);
            }
            console.log('rows length:', rows.length);
            if (rows.length <= 0) {
                return callback('Invalid login credentails..');
            }
            var utilsObject = new utils();
            var unlockedPwd = utilsObject.sha512(data.password, rows[0].login_salt).passwordHash;
            if (unlockedPwd !== rows[0].login_passkey) {
                return callback('Invalid login credentails');
            }

            callback(null, rows);
        });
    }

    updateLastLoginTime(loginData, callback) {
        var self = this;
        var query = "UPDATE `login` SET `last_login`= NOW() WHERE `user_id` = '" + loginData.user_id + "'";
        GLOBAL.db.executeQuery(query, function(err) {
            if (err) {
                return callback(err);
            }
            callback(null);
        });
    }

    getUserById(userId, callback) {
        var self = this;
        var query = "SELECT * FROM `login` INNER JOIN `user` ON `login`.`user_id` = `user`.`user_id` AND `login`.`user_id` = '" + userId + "' AND `user`.`user_status` = 'ACTIVE'";
        GLOBAL.db.executeQuery(query, function(err, result) {
            if (err) {
                return callback(err);
            }
            return callback(null, result);
        });
    }
}

module.exports = Auth;
