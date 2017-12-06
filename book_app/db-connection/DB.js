var mysql = require('mysql');
var envConfig = require('config');
var async = require('async');

//Constructor function
var DB = function() {
    //this.pool = null;//no need to declare
};

DB.prototype.createPool = function() {
    return mysql.createPool({
        host: envConfig.dbConfig.host,
        user: envConfig.dbConfig.user,
        password: envConfig.dbConfig.password,
        database: envConfig.dbConfig.database,
        connectionLimit: envConfig.dbConfig.connectionLimit
    });
};

//Connection pool
DB.prototype.createConnectionPool = function() {
    var self = this;
    //default config
    var dbConfig = {};
    if (config && config.dbConfig) {
        dbConfig = config.dbConfig;
    }
    return mysql.createPool(dbConfig);
};

/**
 * Executes the MySql Query and returns the rows..
 * @param {String} query  query to execute.
 * @param {cb} callback The callback that handles the response.
 **/
DB.prototype.getConnection = function(callback) {
    var self = this;
    if (!GLOBAL.SQLpool) {
        GLOBAL.SQLpool = this.createConnectionPool();
    }
    GLOBAL.SQLpool.getConnection(function(err, connection) {
        if (err) {
            console.log('Error in connecting db:', err);
            connection.release(); //release the connection and send error response
            callback(err);
            return;
        }
        //error  callback
        connection.on('error', function(err) { //on DB error send reponse.
            if (err.code === "PROTOCOL_CONNECTION_LOST") {
                connection.destroy();
                return;
            }
            connection.release();
            return;
        });
        callback(null, connection);
    });
};

/**
 * Get connection from pool of connections
 * @param {cb} callback The callback that handles the response.
 **/
DB.prototype.getPoolConnection = function(callback) {
    //self refers to calling class instance variable.
    var self = this;
    var thisInstance = this;
    //self.connection = null; //no need to save it. removed it
    thisInstance.getConnection(function(err, connection) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, connection);
    });
};

/**
 * Executes the MySql Query and returns the rows..
 * @param {String} query  query to execute.
 * @param {cb} callback The callback that handles the response.
 **/
DB.prototype.executeQuery = function(query, callback) {
    var thisInstance = this;
    async.waterfall([
        function(callback) {
            thisInstance.getPoolConnection(function(err, connection) {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, connection);
            });
        },
        function(connection, callback) {
            connection.query(query, function(err, rows) {
                if (err) {
                    connection.release(); //release the connection after error.
                    console.log("Query execution failed", "Query=" + query, "Error=" + JSON.stringify(err), "Stacktrace=" + err.stack);
                    callback(err, null);
                    return;
                }
                connection.release(); //release the connection after executing the query.
                callback(null, rows);
            });
        }
    ], function(err, records) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, records);
    });
};


/**
 * Executes the MySql Query and returns the rows..
 * @param {String} query  query to execute.
 * @param {cb} callback The callback that handles the response.
 **/
DB.prototype.executePrepQuery = function(query, values, callback) {
    var thisInstance = this;
    async.waterfall([
        function(callback) {
            thisInstance.getPoolConnection(function(err, connection) {
                if (err) {
                    callback(err, null);
                    return;
                }
                callback(null, connection);
            });
        },
        function(connection, callback) {
            connection.query(query, values, function(err, rows) {
                if (err) {
                    connection.release(); //release the connection after error.
                    console.log("Query execution failed", "Query=" + query, "Error=" + JSON.stringify(err), "Stacktrace=" + err.stack);
                    callback(err, null);
                    return;
                }

                connection.release(); //release the connection after executing the query.
                callback(null, rows);
            });
        }
    ], function(err, records) {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, records);
    });
};



DB.prototype.getRecords = function(connection, query, callback) {
    var thisInstance = this;
    connection.query(query, function(err, records) {
        if (err) {
            console.log("Query execution failed", "Query=" + query, "Error=" + JSON.stringify(err), "Stacktrace=" + err.stack);
            callback(err);
            return;
        }
        callback(null, records);
    });
};

/**
 * Establishes SQL transaction connection from the pool and returns the transaction connection object.
 * @param {Object} pool SQL connection pool object.
 * @param {cb} callback The callback that handles the response.
 **/
DB.prototype.createTransaction = function(pool, callback) {
    var self = this;
    if (pool === undefined || pool === null) {
        self.pool = self.createConnectionPool();
    }
    self.getConnection(function(err, connection) {
        if (err) {
            callback(err, null);
            return;
        }
        connection.beginTransaction(function(err) {
            if (err) {
                //GLOBAL.logger.warn("SQL transaction connection create failure", "Error=" + JSON.stringify(err), "Stacktrace=" + err.stack);
                console.log("SQL transaction connection create failure", "Error=" + JSON.stringify(err), "Stacktrace=" + err.stack);
                callback(err, null);
                return;
            }
            callback(null, connection);
        });
    });
};

module.exports = new DB();
