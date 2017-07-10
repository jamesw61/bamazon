'use strict';
const inquirer = require('inquirer');
const connection = require('./connection');
const table = require('./table');
var query = 'SELECT * FROM products ORDER BY dept, price';
var query2 = 'SELECT * FROM products WHERE stock_quantity < 5';

const log = x => console.log(x);

connection.connect((err) => {
    if (err) throw err;
    log(`connected as id  ${connection.threadId}`);
    start();
});

const start = () => {
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
    }]).then((answer) => {
        let pick = answer.menuPick;
        log('---------------');
        log("You chose: " + pick);
        log('---------------');
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

const view = (queryString) => {
    connection.query(queryString, (err, res) => {
        if (err) throw err;        
        for (let i in res) {
            let { id, name, dept, price, stock_quantity } = res[i];
            table.push([id, name, dept, price, stock_quantity]);
        }
        // for (let i in res) {
        //     table.push([res[i].id, res[i].name, res[i].dept, res[i].price, res[i].stock_quantity]);
        // }
        log(table.toString());
    });
    connection.end();
}

const addInventory = () => {
    let choiceArray = [];
    connection.query(query, (err, res) => {
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
            .then((answer) => {
                let amount = parseInt(answer.amount);
                let name = answer.product;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].name === name) {
                        let stock = res[i].stock_quantity + amount;
                        log('-----------------');
                        log(`The current inventory is: ${res[i].stock_quantity}`);
                        log('-----------------');
                        log(`You added ${amount} to the inventory.`);
                        log('-----------------');
                        log(`The new inventory is: ${stock}`);
                        log('-----------------');
                        updateRow(stock, name);
                    }
                }
            });
    });
}

const updateRow = (stock, name) => {
    connection.query(
        "UPDATE products SET ? WHERE ?", [{
            stock_quantity: stock
        }, {
            name: name
        }],
        (err, res) => {
            // console.log(res);
            if (err) throw err;
            view(query);
        });
}

const addProduct = () => {
    let choiceArray = [];
    connection.query('SELECT department_name FROM departments', (err, res) => {
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
        .then((answer) => {
            let name = answer.name;
            let dept = answer.dept;
            let price = parseFloat(answer.price).toFixed(2);
            let quantity = parseInt(answer.stock_quantity);
            createRow(name, dept, price, quantity);
        });
}

const createRow = (name, dept, price, quantity) => {
    connection.query("INSERT INTO products SET ?", {
        name: name,
        dept: dept,
        price: price,
        stock_quantity: quantity,
        product_sales: 0.00
    }, (err, res) => {
        if (err) throw err;
        view(query);
    });
}
