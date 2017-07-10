'use strict'
const Table = require('cli-table');

var table = new Table({
    head: ['Id', 'Product', 'Department', 'Price', 'Quantity Available']
});

module.exports = table;