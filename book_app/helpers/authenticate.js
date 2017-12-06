/* jshint node: true */
/* jshint esnext: true */
'use strict'; 
var utils = require('./utils.js');
class Auth{
    constructor(){

    }


    login(loginDetails, callback) {
        var self = this;
        GLOBAL.async.waterfall(
            [
                function(callback) {
                    console.log('info', 'Login API - validate login');
                    self.validateUser(loginDetails, function(err, loginData){
                        //console.log('validateUser loginData:', loginData);
                        if(err) {
                            return callback(err);
                        }
                        callback(null, loginData);
                    });
                },
                //Update last login information
                function(loginData, callback) {
                    console.log('info','Login API - update last login of the user');
                    self.updateLastLoginTime(loginData, function(err){
                        if(err) {
                            return callback(err);
                        }
                        callback(null, loginData);
                    });
                }
            ],
            function(err, loginData) {
                if(err){
                    callback(err);
                } else {
                    //console.log('Final callback:', loginData);
                    callback(null, loginData);
                }
            }
        );
    };

    //Prototype
    validateUser(data, callback){
        var self = this;
        var query = "SELECT * FROM `login` INNER JOIN `user` ON `login`.`user_id` = `user`.`user_id` AND `login`.`login_user_id` = '"+data.userId+"'";
        console.log('query:', query);
        GLOBAL.db.executeQuery(query, function(err,rows){
            if(err){
                return callback(err);
            }
            //console.log('rows length:', rows.length);
            if (rows.length <= 0) {
                return callback('Invalid login credentails..');
            }
            var utilsObject = new utils();
            var unlockedPwd = utilsObject.sha512(data.password, rows[0].login_salt).passwordHash;
            console.log('unlockedPwd:', unlockedPwd);
            console.log('rows[0].login_passkey:', rows[0].login_passkey);
            if(unlockedPwd !== rows[0].login_passkey) {
                return callback('Invalid login credentails');
            }
            callback(null, rows);
        });
    };

    updateLastLoginTime(loginData, callback) {
        var self = this;
        var query = "UPDATE .`login` SET `last_login`= NOW() WHERE `users_id` = '" + loginData.users_id + "'";
        
        GLOBAL.db.executeQuery(query, function(err){
            if(err){
                return callback(err);
            }
            callback(null);
        });
    };

    
    getUserById(userId, callback){
        var self = this;
        //var query = "SELECT * FROM Users WHERE login_id = "+userId;
        var query = "SELECT * FROM `login` INNER JOIN `user` ON `login`.`user_id` = `user`.`user_id` AND `login`.`user_id` = '"+userId+"'";
console.log(" "+query);
        GLOBAL.db.executeQuery(query, function(err, result) {
            if(err) {
               console.log("err query "+result);
                return callback(err);
            }
console.log("err query "+result);
            return callback(null, result);
        });
    };
}

module.exports =  Auth;