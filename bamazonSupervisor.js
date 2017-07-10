'use strict';
const connection = require('./connection');
const inquirer = require('inquirer');
const Table = require('cli-table');
var table = new Table({
    head: ['Department Id', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit']
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id  ${connection.threadId}`);
    start();
});

const view = () => {
    let queryString = 'SELECT * FROM departments LEFT JOIN (SELECT SUM(product_sales) AS sales, dept FROM products GROUP BY dept) AS abc ON (departments.department_name = abc.dept);'
    connection.query(queryString, (err, res) => {
        if (err) throw err;
        for (let i in res) {
            let {sales, over_head_costs, department_name, department_id} = res[i];
            if (sales == null) {
                sales = 0.00;
            }
            var tot = (parseFloat(sales) - parseFloat(over_head_costs)).toFixed(2);
            table.push([department_id, department_name, over_head_costs, sales, tot]);            
        }
        	console.log(table.toString());
    });
    connection.end();
}

const start = () => {
    inquirer.prompt([{
            type: 'rawlist',
            name: 'menuPick',
            message: 'What would you like to do?',
            choices: ['View Product Sales by Department', 'Create New Department']
        }])
        .then((answer) => {
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

const createDept = () => {
    inquirer.prompt([{
            type: 'input',
            name: 'department_name',
            message: 'What department would you like to add?'
        }, {
            type: 'input',
            name: 'over_head_costs',
            message: 'What are the overhead costs for this department?'
        }])
        .then((answer) => {
            createRow(answer.department_name, answer.over_head_costs);
        });
}

const createRow = (department_name, over_head_costs) => {
    connection.query("INSERT INTO departments SET ?", {
        department_name: department_name,
        over_head_costs: over_head_costs
    }, (err, res) => {
        if (err) throw err;
        view();
    });
}
