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
    start();
});

var queryString = 'SELECT * FROM products';

function start() {
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
                var prodIndex = answer.idEntered - 1;
                inquirer.prompt({
                        type: 'input',
                        name: 'quantity',
                        message: 'How many would you like to buy?'
                    })
                    .then(function(response) {
                        var quant = response.quantity;
                        console.log(quant + " | " + res[prodIndex].stock_quantity);
                        var updatedStock = res[prodIndex].stock_quantity - quant;
                        if (quant < res[prodIndex].stock_quantity) {                            
                            var cost = (quant * res[prodIndex].price).toFixed(2);
                            var sales = (res[prodIndex].product_sales).toFixed(2);
                            var updatedSales = parseFloat(sales) + parseFloat(cost);
                            // console.log("sales  " + sales);
                            updateRow(updatedStock, updatedSales, (prodIndex + 1));
                            console.log('Transaction Successful!  You have been charged $' + cost);
                        } else {
                            console.log('Insuffecient Quantity!');
                        }
                            connection.end();

                    });
            });
    });
}

function updateRow(stock, sales, id) {
    connection.query(
        "UPDATE products SET ? WHERE ?", [{
            stock_quantity: stock,
            product_sales: sales
        }, {
            id: id
        }],
        function(err, res) {
            if (err) throw err;
        });
}





// module.exports = connection.connect;
