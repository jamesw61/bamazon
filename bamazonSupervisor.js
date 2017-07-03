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

function start() {
    inquirer.prompt([{
            type: 'rawlist',
            name: 'menuPick',
            message: 'What would you like to do?',
            choices: ['View Product Sales by Department', 'Create New Department']
        }])
        .then(function(answer) {
            var x = JSON.stringify(answer, null, 2);
            var y = JSON.parse(x);
            console.log(y);
            switch(y.menuPick) {
            	case 'View Product Sales by Department':
            	view();
            	break;
            	case 'Create New Department':
            	createDept();
            	break;
            }
          
        });
}

function view() {
	console.log('viewed');
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
            var x = JSON.stringify(answer, null, 2);
            var y = JSON.parse(x);
            console.log(y);
            var department_name = y.department_name;
            var over_head_costs = y.over_head_costs;            
            createRow(department_name, over_head_costs);
        });
}

function createRow(department_name, over_head_costs){
    connection.query("INSERT INTO departments SET ?",
    {
        department_name: department_name,
        over_head_costs: over_head_costs
    }, function(err,res){
        if(err) throw err;        
    });
}