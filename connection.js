'use strict';
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "steel61sql",
    database: 'bamazon'
});

module.exports = connection;
