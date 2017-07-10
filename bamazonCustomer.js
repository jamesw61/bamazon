'use strict';
const inquirer = require('inquirer');
const connection = require('./connection');
const table = require('./table');
var queryString = 'SELECT * FROM products';

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id  ${connection.threadId}`);
    start();
});

const start = () => {
    connection.query(queryString, (err, res) => {
        if (err) throw err;
        for (let i in res) {
            table.push([parseInt(i) + 1, res[i].name, res[i].dept, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        inquirer.prompt({
                type: 'input',
                name: 'idEntered',
                message: "Enter the Id of the product you would like to buy",
                validate: (value) => {
                    if (value < res.length + 1) {
                        return true;
                    }
                    return '\nPlease enter a valid id';
                }

            })
            .then((answer) => {
                let prodIndex = answer.idEntered - 1;
                console.log('--------------');
                console.log(`You chose ' ${res[prodIndex].name}`);
                console.log('--------------');
                inquirer.prompt({
                        type: 'input',
                        name: 'quantity',
                        message: 'How many would you like to buy?'
                    })
                    .then((response) => {
                        let {stock_quantity, price, product_sales, name} = res[prodIndex];
                        let quant = response.quantity;
                        let updatedStock = stock_quantity - quant;
                        if (quant < stock_quantity) {
                            let cost = (quant * price).toFixed(2);
                            let sales = (product_sales).toFixed(2);
                            let updatedSales = parseFloat(sales) + parseFloat(cost);
                            updateRow(updatedStock, updatedSales, name);
                            console.log('--------------');
                            console.log(`Number of ${name} bought:  ${quant}`);
                            console.log(`Transaction Successful!  You have been charged $${cost}`);
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

const updateRow = (stock, sales, name) => {
    connection.query(
        "UPDATE products SET ? WHERE ?", [{
            stock_quantity: stock,
            product_sales: sales
        }, {
            name: name
        }],
        (err, res) => {
            if (err) throw err;
        });
}

