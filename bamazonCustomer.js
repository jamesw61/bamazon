'use strict';
var mysql = require("mysql");
var inquirer = require('inquirer');
var connection = require('./connection');
var Table = require('cli-table');
var table = new Table({
    head: ['Id', 'Product', 'Department', 'Price', 'Quantity Available']
});
var queryString = 'SELECT * FROM products';
// var connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "steel61sql",
//     database: 'bamazon'
// });

connection.connect(function(err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    start();
});

function start() {
    connection.query(queryString, function(err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            table.push([i + 1, res[i].name, res[i].dept, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        inquirer.prompt({
                type: 'input',
                name: 'idEntered',
                message: "Enter the Id of the product you would like to buy",
                validate: function(value) {
                    if (value < res.length + 1) {
                        return true;
                    }
                    return '\nPlease enter a valid id';
                }

            })
            .then(function(answer) {
                var prodIndex = answer.idEntered - 1;
                console.log('--------------');
                console.log('You chose ' + res[prodIndex].name);
                console.log('--------------');
                inquirer.prompt({
                        type: 'input',
                        name: 'quantity',
                        message: 'How many would you like to buy?'
                    })
                    .then(function(response) {
                        var quant = response.quantity;
                        var updatedStock = res[prodIndex].stock_quantity - quant;
                        if (quant < res[prodIndex].stock_quantity) {
                            var cost = (quant * res[prodIndex].price).toFixed(2);
                            var sales = (res[prodIndex].product_sales).toFixed(2);
                            var updatedSales = parseFloat(sales) + parseFloat(cost);
                            updateRow(updatedStock, updatedSales, res[prodIndex].name);
                            console.log('--------------');
                            console.log('Number of ' + res[prodIndex].name + ' bought: ' + quant);
                            console.log('Transaction Successful!  You have been charged $' + cost);
                            console.log('--------------');
                        } else {
                            console.log('--------------');
                            console.log('Insufficient Quantity!');
                            console.log('--------------');
                        }
                        connection.end();
                    });
            });
    });
}

function updateRow(stock, sales, name) {
    connection.query(
        "UPDATE products SET ? WHERE ?", [{
            stock_quantity: stock,
            product_sales: sales
        }, {
            name: name
        }],
        function(err, res) {
            if (err) throw err;
        });
}
