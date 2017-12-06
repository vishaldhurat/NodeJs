/* jshint node: true */
/* jshint esnext: true */
'use strict';
var config = require('config');
var nodemailer = require('nodemailer');
var smtpTransporter = require("nodemailer-smtp-transport")
class Emailer{
    constructor(user){
        var self = this;
        self.response = {};
        self.response.data = {};
        self.user = user;
    }

    sendEmail(callback){
        var self = this;
        var smtpTransport = self.createTransport();
        smtpTransport.sendMail({
           from: config.emailList.fromEmail, // sender address
           to: config.emailList.toEmail, // comma separated list of receivers
           subject: "This is a test email from cafelaundry", // Subject line
           text: "Hi Testing email from cafe Laundry!!" // plaintext body
        }, function(error, response){
            if(error){
                console.log(error);
                smtpTransport.close();
                callback(error);
            } else {
                smtpTransport.close();
                console.log("Message sent: " + response.message);
                callback(null, response);
            }
        });
    }

    createTransport(){
        return nodemailer.createTransport(smtpTransporter(config.smtp));
    }

    getEmailTemplate(emailTemplateType){
        //emailTemplatetype  can be user creation email, schedule delivery email for pickup_boy/admin, schedule delivery email for consumer
    }
}
module.exports =  Emailer;