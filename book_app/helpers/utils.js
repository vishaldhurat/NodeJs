'use strict';
var crypto = require('crypto');
/**
 * Defines validations.
 * @class
 */
var utils = function() {};

/**
 * genrates random string of charecters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
utils.prototype.genRandomString = function(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length); /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
utils.prototype.sha512 = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    console.log('upate:', password);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

module.exports = utils;
