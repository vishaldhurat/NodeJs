//Defines error message text
var ErrorMessages ={
	default_error_message:"Oops! something happened!.",
	dbError:"Database error!.",
	default_success_message:"Successfully Proccessed Request",
	default_success_code:0,
	default_error_code:7,
	dbErrorMessages:{
		"ECONNREFUSED" : "Unable to connect to the database"		
	},
	login_salt_length:10
};
module.exports = ErrorMessages;
