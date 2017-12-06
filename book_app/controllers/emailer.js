var express = require('express');
var router = express.Router();
var EmailModel = require('../models/Emailer.js');

router.get('/send', function(req, res){
	var userDetails = req.userData || {};
	var emailerInstance = new EmailModel(userDetails);
	emailerInstance.sendEmail(function(err, response){
		if(err){
			res.status(500).json(err);
		} else {
			res.json(response);
		}
	});
});

module.exports = router;