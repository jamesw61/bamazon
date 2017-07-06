'use strict';
var mysql = require("mysql");
var inquirer = require('inquirer');
// var connection = require('./bamazonCustomer');
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

function start() {
    inquirer.prompt([{
        type: 'rawlist',
        name: 'menuPick',
        message: 'What do you want to do?',
        choices: [
            'View Products for Sale',
            'View Low Inventory',
            new inquirer.Separator(),
            'Add to Inventory',
            'Add New Product'
        ]
    }]).then(function(answer) {
        var pick = answer.menuPick;
        console.log(pick);
        switch (pick) {
            case 'View Products for Sale':
                var query = 'SELECT * FROM products';
                view(query);
                break;
            case 'View Low Inventory':
                var query2 = 'SELECT * FROM products WHERE stock_quantity < 5';
                view(query2);
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                console.log('d');
                addProduct();
                break;
        }
        // connection.end();
    });
}

var view = function(queryString) {
    connection.query(queryString, function(err, res) {
        if (err) throw err;
        console.log("\nId | Product | Department | Price | Quantity Available");
        for (let i = 0; i < res.length; i++) {
            console.log("--------------------")
            console.log(res[i].id + " | " + res[i].name + " | " + res[i].dept + " | " + res[i].price + " | " + res[i].stock_quantity + "\n");
        }
    });
    connection.end();
}

var choiceArray = [];
var addInventory = function() {
    var query = 'SELECT * FROM products';
    var name = "";
    var stock = 0;
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            choiceArray.push(res[i].name);
        }
        console.log(choiceArray);
        inquirer.prompt([{
                type: 'rawlist',
                name: 'product',
                message: "What product would you like to replenish?",
                choices: choiceArray
            }, {
                type: 'input',
                name: 'amount',
                message: 'How many would you like to add?'
            }])
            .then(function(answer) {
                console.log(answer);
                var x = JSON.stringify(answer, null, 2);
                var y = JSON.parse(x);
                // var amount = parseInt(y.amount);
                var amount = parseInt(answer.amount);
                console.log(amount);

                // name = y.product;
                name = answer.product;
                console.log(name);

                console.log(name + "    " + amount);
                for (let j = 0; j < res.length; j++) {
                    if (res[j].name === name) {
                        stock = res[j].stock_quantity + amount;
                        updateRow(stock, name);
                        connection.end();
                        return;
                    }
                }
            });
    });
}

function updateRow(stock, name) {
    connection.query(
        "UPDATE products SET ? WHERE ?", [{
            stock_quantity: stock
        }, {
            name: name
        }],
        function(err, res) {
            console.log(res);
            if (err) throw err;
        });
}

function addProduct() {
    inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'What product would you like to add?'
        }, {
            type: 'input',
            name: 'dept',
            message: 'What department?'
        }, {
            type: 'input',
            name: 'price',
            message: 'What is the selling price?'
        }, {
            type: 'input',
            name: 'stock_quantity',
            message: 'How many will be stocked?'
        }])
        .then(function(answer) {
            var x = JSON.stringify(answer, null, 2);
            var y = JSON.parse(x);
            console.log(y);
            var name = y.name;
            var dept = y.dept;
            var price = parseFloat(y.price);
            var quantity = parseInt(y.stock_quantity);
            createRow(name, dept, price, quantity);
        });
}


function createRow(name, dept, price, quantity) {
    connection.query("INSERT INTO products SET ?", {
        name: name,
        dept: dept,
        price: price,
        stock_quantity: quantity
    }, function(err, res) {
        if (err) throw err;
    });
}
