'use strict';
var mysql = require("mysql");
var inquirer = require('inquirer');
var connection = require('./connection');
var Table = require('cli-table');
var table = new Table({
    head: ['Id', 'Product', 'Department', 'Price', 'Quantity Available']
});
var query = 'SELECT * FROM products ORDER BY dept, price';
var query2 = 'SELECT * FROM products WHERE stock_quantity < 5';
var choiceArray = [];
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
        console.log('---------------');
        console.log("You chose: " + pick);
        console.log('---------------');
        switch (pick) {
            case 'View Products for Sale':
                view(query);
                break;
            case 'View Low Inventory':
                view(query2);
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;
        }
    });
}

var view = function(queryString) {
    connection.query(queryString, function(err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].name, res[i].dept, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
    });
    connection.end();
}


var addInventory = function() {
    var name = "";
    var stock = 0;
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            choiceArray.push(res[i].name);
        }
        inquirer.prompt([{
                type: 'rawlist',
                name: 'product',
                message: "What product would you like to replenish?",
                pageSize: 15,
                choices: choiceArray
            }, {
                type: 'input',
                name: 'amount',
                message: 'How many would you like to add?'
            }])
            .then(function(answer) {
                var amount = parseInt(answer.amount);
                name = answer.product;
                for (let j = 0; j < res.length; j++) {
                    if (res[j].name === name) {
                        stock = res[j].stock_quantity + amount;
                        console.log('-----------------');
                        console.log('The current inventory is: ' + res[j].stock_quantity);
                        console.log('-----------------');
                        console.log('You added ' + amount + ' to the inventory.');
                        console.log('-----------------');
                        console.log('The new inventory is: ' + stock);
                        console.log('-----------------');
                        updateRow(stock, name);
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
            // console.log(res);
            if (err) throw err;
            view(query);
        });
}

function addProduct() {
    choiceArray = [];
    connection.query('SELECT department_name FROM departments', function(err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            choiceArray.push(res[i].department_name);
        }
    });
    inquirer.prompt([{
            type: 'input',
            name: 'name',
            message: 'What product would you like to add?'
        }, {
            type: 'rawlist',
            name: 'dept',
            message: "What department?",
            pageSize: 15,
            choices: choiceArray
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
            var name = answer.name;
            var dept = answer.dept;
            var price = parseFloat(answer.price).toFixed(2);
            var quantity = parseInt(answer.stock_quantity);
            createRow(name, dept, price, quantity);
        });
}

function createRow(name, dept, price, quantity) {
    connection.query("INSERT INTO products SET ?", {
        name: name,
        dept: dept,
        price: price,
        stock_quantity: quantity,
        product_sales: 0.00
    }, function(err, res) {
        if (err) throw err;
        view(query);
    });
}
