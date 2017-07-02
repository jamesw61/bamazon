'use strict';
var mysql = require("mysql");
var inquirer = require('inquirer');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "steel61sql",
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
});

var queryString = 'SELECT * FROM products';

connection.query(queryString, function(err, res) {
    if (err) throw err;
    console.log("\nId | Product | Department | Price | Quantity Available");
    for (let i = 0; i < res.length; i++) {
        console.log("--------------------")
        console.log(res[i].id + " | " + res[i].name + " | " + res[i].dept + " | " + res[i].price + " | " + res[i].stock_quantity + "\n");

    }
    inquirer.prompt({
            type: 'input',
            name: 'idEntered',
            message: "Enter the Id of the product you would like to buy",
            validate: function(value) {
                if (res[value].id) {
                    return true;
                }
                return 'Please enter a valid Id number';
            }
        })
        .then(function(answer) {
            var inputEntered = JSON.stringify(answer, null, 2);
            var inputParsed = JSON.parse(inputEntered);
            var prodId = parseInt(inputParsed.idEntered) - 1;
            console.log(res[prodId].name);

            inquirer.prompt({
                    type: 'input',
                    name: 'quantity',
                    message: 'How many would you like to buy?'
                })
                .then(function(response) {
                    var quantEntered = JSON.stringify(response, null, 2);
                    var quantParsed = JSON.parse(quantEntered);
                    var quant = parseInt(quantParsed.quantity);
                    console.log(quant + " | " + res[prodId].stock_quantity);
                    var newStock = res[prodId].stock_quantity - quant;
                    if (quant < res[prodId].stock_quantity) {
                        updateRow(newStock, (prodId + 1));
                        var cost2 = quant * res[prodId].price;
                        var cost = cost2.toFixed(2);
                        console.log('Transaction Successful!  You have been charged $' + cost);
                    } else {
                        console.log('Insuffecient Quantity!');
                    }

                });
        });
});

function updateRow(stock, id) {
    connection.query(
        "UPDATE products SET ? WHERE ?", [{
            stock_quantity: stock
        }, {
            id: id
        }],
        function(err, res) {
            if (err) throw err;
        });
}
