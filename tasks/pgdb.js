"use strict";

var db = require('pg-db');
var _ = require('underscore');
var async = require('async');

module.exports = function (grunt) {

    grunt.task.registerMultiTask("pgdb","Performs db queries",function () {

        var done = this.async();

        var options = this.options();
	
        // attempt to get DB connection parameters:
        var connection = options.connection || null;
        
        var myDB = db(connection);
        
        var gruntCallback = function gruntPGDBCallback(err, result) {
            if (err) {
                grunt.log.error(err.toString());
                throw err; 
                done();
            } else {
                grunt.log.ok('Query successfully executed');
                done();
            }
        };
        var commands = [];
        
        var executeSql = function gruntPGExecuteSql(sqlObj, asyncCB) {
            if (typeof sqlObj === 'string') {
                sqlObj = { sql: sqlObj };
            }
            grunt.log.writelns("calling pg query `" + sqlObj.sql + "`");
            return myDB.execute(sqlObj.sql, sqlObj.params||[], asyncCB);
        };
        
        if (!_.isArray(options.sql)) {
            commands.push({ sql: options.sql, params: options.params });
        } else {
            commands = options.sql;
        }
        async.mapSeries(commands, executeSql, gruntCallback);

    });
};
