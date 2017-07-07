'use strict';
var mysql = require("mysql");
var connection = require('./connection');
var inquirer = require('inquirer');
var Table = require('cli-table');
var table = new Table({
    head: ['Department Id', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit']
});
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

function view() {
    var queryString = 'SELECT * FROM departments LEFT JOIN (SELECT SUM(product_sales) AS sales, dept FROM products GROUP BY dept) AS abc ON (departments.department_name = abc.dept);'
    connection.query(queryString, function(err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            var sales = res[i].sales;
            if (sales == null) {
                sales = 0.00;
            }
            var tot = (parseFloat(sales) - parseFloat(res[i].over_head_costs)).toFixed(2);
            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, sales, tot]);            
        }
        	console.log(table.toString());
    });
    connection.end();
}

function start() {
    inquirer.prompt([{
            type: 'rawlist',
            name: 'menuPick',
            message: 'What would you like to do?',
            choices: ['View Product Sales by Department', 'Create New Department']
        }])
        .then(function(answer) {
            switch (answer.menuPick) {
                case 'View Product Sales by Department':
                    view();
                    break;
                case 'Create New Department':
                    createDept();
                    break;
            }
        });
}



function createDept() {
    inquirer.prompt([{
            type: 'input',
            name: 'department_name',
            message: 'What department would you like to add?'
        }, {
            type: 'input',
            name: 'over_head_costs',
            message: 'What are the overhead costs for this department?'
        }])
        .then(function(answer) {
            createRow(answer.department_name, answer.over_head_costs);
        });
}

function createRow(department_name, over_head_costs) {
    connection.query("INSERT INTO departments SET ?", {
        department_name: department_name,
        over_head_costs: over_head_costs
    }, function(err, res) {
        if (err) throw err;
        view();
    });
}
