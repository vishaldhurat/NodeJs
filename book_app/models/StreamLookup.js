/* jshint node: true */
/* jshint esnext: true */
'use strict'; //Grunt throws error: SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
var returnResponse = require('./response');
var utils = require('../helpers/utils.js');
/**
* Defines the Stream lookup operation.
* @class User
**/
class StreamLookup {

    constructor(lookup) {
        var self = this;
        self.response = {};
        self.response.data = {};
        //self.loggedInUserId = user.id;
        self.lookup = lookup;
    }

    /**
     * Get StreamLookup List.
     * @function
     * @param {string} userId - User Id
     * @param {function} callback - callback function
    */
    getStreamLookup(callback){
        var self = this;
        
        var query = " SELECT * FROM `heroku_862e36cb50be6ef`.`stream_lookup` order by `stream_lookup_id` ";
        GLOBAL.db.executeQuery(query,function(err, result) {
            if(err) {
                returnResponse.errorMessage(self, err, GLOBAL.config.default_error_code, callback);
                return;
            }
            self.response.data.result = JSON.parse(JSON.stringify(result));
            returnResponse.successMessage(self, GLOBAL.config.default_success_message, GLOBAL.config.default_success_code, callback);
        });
    }

    /**
     * Get User StreamLookup by address Id and User Id.
     * @function
     * @param {function} callback - callback function
    */
    getStreamLookupById(lookupId,callback){
        var self = this;
        var query = " SELECT * FROM `heroku_862e36cb50be6ef`.`stream_lookup`  where `stream_lookup_id` = ? ";
        GLOBAL.db.executePrepQuery(query, lookupId,function(err, result) {
            if(err) {
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
}

module.exports = StreamLookup;
