/* jshint node: true */
/* jshint esnext: true */
'use strict'; 
var utils = require('../helpers/utils.js');
var config = require('config');
var request = require('request');

class Message{
    constructor(user){
        var self = this;
        self.response = {};
        self.response.data = {};
        self.user = user;
    }

    sendMessage(mobileNumbers, callback){
        var email = config.textLocal.email;
        var apiKey = config.textLocal.apiKey;
        var smsHost = config.textLocal.host;
        var mobileNumber = 9986477769;//get array of numbers
        var message = "This is a test Message"; //text message.
        var smsPath = "apiKey="+apiKey+"&sender=TXTLCL&numbers=91"+mobileNumber +"&message="+ message;
        var url = smsHost + smsPath;
        console.log('SMS Url:', url);
        request(url, function (error, response, body) {
              if (!error && response.statusCode == 200) {
                console.log("SMS Response success:", body); // Show the HTML for the Google homepage.
                callback(null, body);
              } else {
                console.log("SMS Error:", error);
                callback(error);
              }
        });
    }
}

module.exports =  Message;