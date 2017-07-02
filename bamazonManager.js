'use strict';
var mysql = require("mysql");
var inquirer = require('inquirer');
// var connection = require('./bamazonCustomer'); //????

// connection.connect(function(err) {
//     if (err) throw err;
//     console.log('connected as id ' + connection.threadId);
// });

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
    var pick3 = JSON.stringify(answer, null, '  ');
    var pick2 = JSON.parse(pick3);
    var pick = pick2.menuPick;
    console.log(pick);
    switch (pick) {
        case 'View Products for Sale':
            console.log('a');
            var query = 'SELECT * FROM products';
            view(query);
            break;
        case 'View Low Inventory':
            console.log('b');
			var query2 = 'SELECT * FROM products WHERE stock_quantity < 5';
			view(query2);
            break;
        case 'Add to Inventory':
            console.log('c');

            break;
        case 'Add New Product':
            console.log('d');
            break;
    }
});

var view = function(queryString) {	
    connection.query(queryString, function(err, res) {
        if (err) throw err;
        console.log("\nId | Product | Department | Price | Quantity Available");
        for (let i = 0; i < res.length; i++) {
            console.log("--------------------")
            console.log(res[i].id + " | " + res[i].name + " | " + res[i].dept + " | " + res[i].price + " | " + res[i].stock_quantity + "\n");
        }
    });
}


