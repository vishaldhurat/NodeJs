
/**
* @callback cb Method to be called on complete.
**/

/**
* Returns the success message on request complete and releases the SQL connection.
* @method successMessage
* @param {Object} self Instance data of a class.
* @param {String} msg Message to be returned in the response.
* @param {Integer} HTTPCode HTTP Status Code to be returned in the response.
* @param {cb} callback The callback that handles the response.
**/
function successMessage(self, msg, HTTPCode, callback) {
    self.response.data.responseCode = GLOBAL.config.default_success_code;
    self.response.data.responseDesc = msg;
    self.response.HTTPCode = HTTPCode;
    callback(null, self.response);
}

/**
* Returns the error message on request complete and releases the SQL connection.
* @method errorMessage
* @param {Object} self Instance data of a class.
* @param {String} error_msg Message to be returned in the response for error scenario.
* @param {Integer} HTTPCode HTTP Status Code to be returned in the response for error scenario.
* @param {cb} callback The callback that handles the response.
**/

function errorMessage(self, error_msg, HTTPCode, callback) {
    if(typeof error_msg === 'object') {
        if(!!error_msg.sqlState) {
            self.response.data.responseDesc = ((error_msg.errno in GLOBAL.config.sql_error_message) ? GLOBAL.config.sql_error_message[error_msg.errno] : GLOBAL.config.db_error_message);
        } else {
            self.response.data.responseDesc = ((error_msg.errno === "ECONNREFUSED") ? GLOBAL.config.sql_error_message[error_msg.errno] : GLOBAL.config.db_error_message);
        }
    } else {
        self.response.data.responseDesc = error_msg;
    }
    self.response.data.responseCode = GLOBAL.config.default_error_code;
    self.response.HTTPCode = HTTPCode;
    callback(self.response, null);
}

module.exports.successMessage = successMessage;
module.exports.errorMessage = errorMessage;