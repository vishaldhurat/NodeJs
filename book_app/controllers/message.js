var express = require('express');
var router = express.Router();
var MessageModel = require('../models/Message.js');

router.get('/send', function(req, res){
	var userDetails = req.userData || {};
	var msgInstance = new MessageModel(userDetails);
	var mobileNumbersArray = [];
	msgInstance.sendMessage(mobileNumbersArray, function(err, users){
		if(err){
			res.status(500).json(err);
		} else {
			res.json(users);
		}
	});
});

module.exports = router;