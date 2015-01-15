"use strict";

var assert = require("assert");

describe("pgdb", function () {
    var gruntPGDB;
    beforeEach(function () {
        gruntPGDB = require("./../tasks/pgdb.js");
    });
    it("should accept connection params", function (done) {
        var optionsFixture = { connection: { user: "test" } };
        var testResult = gruntPGDB.getConnectionParams(optionsFixture);
        assert.deepEqual(testResult, optionsFixture.connection);
        done();
    });
    it("connection should default to null", function (done) {
        var optionsFixture = { sql: "SELECT 1 + 1;" };
        var testResult = gruntPGDB.getConnectionParams(optionsFixture);
        assert.equal(testResult, null);
        done();
    });
    it("should accept a single sql string", function (done) {
        var optionsFixture = { sql: "SELECT * FROM foo" };
        var testResult = gruntPGDB.getSQLToExecute(optionsFixture);
        var expectedResult = [ { sql: optionsFixture.sql, params: undefined } ];
        assert.deepEqual(testResult, expectedResult);
        done();
    });
    it("should accept an array of sql strings", function (done) {
        var optionsFixture = { sql: [ "SELECT * FROM foo", "SELECT * FROM bar" ] };
        var testResult = gruntPGDB.getSQLToExecute(optionsFixture);
        var expectedResult = [ { sql: optionsFixture.sql[0] }, { sql: optionsFixture.sql[1] } ];
        assert.deepEqual(testResult, expectedResult);
        done();
    });
    it("should accept an array of objects with sql and params properties", function (done) {
        var optionsFixture = { sql: [
            { sql: "SELECT * FROM foo WHERE col = $1", params: ["test"] },
            { sql: "SELECT * FROM bar WHERE col = $1", params: ["test1"] }
        ] };
        var testResult = gruntPGDB.getSQLToExecute(optionsFixture);
        var expectedResult = optionsFixture.sql;
        assert.deepEqual(testResult, expectedResult);
        done();
    });
    it("should throw an error if no sql option is defined", function (done) {
        var optionsFixture = { sqql: [
            { sql: "SELECT * FROM foo WHERE col = $1", params: ["test"] },
            { sql: "SELECT * FROM bar WHERE col = $1", params: ["test1"] }
        ] };
        var testBlock = function () { gruntPGDB.getSQLToExecute(optionsFixture); };
        var expectedResult = optionsFixture.sql;
        assert.throws(testBlock);
        done();
    });
    it("should throw an error if sql option is not a string or array", function (done) {
        var optionsFixture = { sql: 1 };
        var testBlock = function () { gruntPGDB.getSQLToExecute(optionsFixture); };
        var expectedResult = optionsFixture.sql;
        assert.throws(testBlock);
        done();
    });
});
