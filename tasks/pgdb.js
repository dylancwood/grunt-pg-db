"use strict";

var db = require("pg-db");
var _ = require("underscore");
var async = require("async");

var gruntPGDB =  function (grunt) {

    grunt.task.registerMultiTask("pgdb", "Performs db queries", function () {
        var done = this.async();
        var options = this.options();
        // attempt to get DB connection parameters:
        var connection = gruntPGDB.getConnectionParams(options);
        var sql = gruntPGDB.getSQLToExecute(options);
        var myDB = db(connection);

        // private functions
        /**
         * callback to signal that task has completed successfully
         * should be called after all SQL has been executed
         * @param {null|Error} err An optional error object if an error was encountered
         * @param {object} result an array of the results for each execution
         * @return void
         */
        var gruntCallback = function gruntPGDBCallback(err, result) {
            if (err) {
                grunt.log.error(err.toString());
                throw err;
            } else {
                grunt.log.ok("Query successfully executed");
            }
            done();
        };


        /**
         * execute the sql contained in the sqlObj then call the asyncCB to continue iteration
         * @param {object} sqlObj an object of the following form: {sql: "SELECT...", params:[...]}
         * the params property is optional (will default to an empty array);
         * @param {function} asyncCB  a callback to be executed when the execution has completed.
         */
        var executeSQL = function gruntPGExecuteSql(sqlObj, asyncCB) {
            // convert string toj
            if (!sqlObj.sql) {
                throw new Error("no sql property in sqlObj");
            }
            // log sql to be executed
            grunt.log.writelns("executing pg query `" + sqlObj.sql + "`");
            // execute SQL
            return myDB.execute(sqlObj.sql, sqlObj.params || [], asyncCB);
        };

        // execute each sql statement in series
        async.mapSeries(sql, executeSQL, gruntCallback);
    });
};


gruntPGDB.getConnectionParams =  function (options) {
    if (options && options.connection) {
        return options.connection;
    }
    return null;
};

gruntPGDB.getSQLToExecute =  function (options) {
    var commands = [];
    if (!options.sql) {
        throw new Error("No sql option specified");
    } else if (_.isString(options.sql)) {
        commands.push({ sql: options.sql, params: options.params });
    } else if (_.isArray(options.sql)) {
        commands = options.sql.map(function convertStringsToObj(sql) {
            if (_.isString(sql)) {
                return { sql: sql };
            }
            return sql;
        });
    } else {
        throw new Error("Expect sql to be array or string, instead got `" + typeof options.sql + "`");
    }
    return commands;
};

module.exports = gruntPGDB;
