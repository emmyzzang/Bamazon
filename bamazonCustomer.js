// NODE DRIVERS ZOOM ZOOM 
const mysql = require("mysql"); 
const inquirer = require("inquirer");
const accounting = require("accounting"); 
const chalk = require("chalk");
const Table = require('cli-table');
const Bamazon = require('./BamazonAccounting');

// SHOULD I MOVE THIS // POSSIBLE TO DO 
// // DB CONFIG 
// let connection = mysql.createConnection({
// 	host: 'localhost', 
// 	port: 3306,
// 	user: 'root', 
// 	password: '', 
// 	database: 'Bamazon'
// }); 

connection.connect(function(err) {
	if (err) throw err; 
	console.log('Your database requires additional pylons!');
	start(); 
}); 

let max, col = ['Item ID', 'Product Name', 'Price'];


// LOGIC  
// Print all rows of columns 
let start = function() {
  var query = Bamazon.createQuery(col);
  connection.query(query, function(err, res) {
    handleQuery(res);
  });
};

let handleQuery = function(res) {
  Bamazon.printData(res,col);
  max = res[res.length - 1]['Item ID'];
  chooseItem(max);
};

// Then we handle the user input as it relates to the item data, handling max value of ItemID 
let chooseItem = function(max) {
  // Prompt user for id of the ItemID in the form of an array of objects via inquirer
  // Validate the value as greater than or equal to zero but less than or equal to max val
  // And is a whole number between 1 and without a period or extra spaces 
  inquirer.prompt([{
    name: "id",
    type: "input",
    message: "What is the item ID of the product you would like to buy?",
    validate: function(value) {
      if (value>=0 && value<=max && value%1 === 0 && value.indexOf(' ')<0 && value.indexOf('.')<0) {
        return true;
      } else {
        return 'Please type a whole number between 1 and ' + max + ' without a period or extra spaces';
      }
    }
  } , {
    // Prompt the user for quantity THEN obvs care about the answer soooo
    // grab that answer and use it as a handler to check quantity in a comparator function 
    name: "quantity",
    type: "input",
    message: "How many would you like to buy?",
    validate: Bamazon.validateQuantity
  }]).then(function(answer) {
    checkQuantity(answer);
  });
};

// Check quantity contained within user input answer against the quantity that is left
// Query the database,find the difference 
let checkQuantity = function(answer) {
  let query = 'SELECT StockQuantity, Price, DepartmentName FROM Products WHERE ItemID = ?';
  let params = answer.id;
  connection.query(query, params, function(err, res) {
    if (res[0].StockQuantity < answer.quantity) {
      console.log(chalk.bold.red('Insufficient quantity.  Please select a quantity equal to or below ' + res[0].StockQuantity) + '.');
      chooseItem(max);
    } else {
      let total = answer.quantity * res[0].Price;
      let newQuantity = res[0].StockQuantity-answer.quantity;
      updateQuantity(answer.id,total,newQuantity);
      queryTotal(res[0].DepartmentName,total);
    }
  });
};

// Update quantity with the new quant and show the customer the total cost of their purchase 
let updateQuantity = function(id,total,newQuantity) {
  let query = 'UPDATE Products SET StockQuantity = ? WHERE ItemID = ?';
  let params = [newQuantity,id];
  connection.query(query, params, function(err, res) {
    console.log(chalk.bold.blue('\nTotal cost: ') + chalk.bold.yellow(accounting.formatMoney(total)));
    console.log(chalk.bold.blue('Thank you come again!'));
  });
};

let queryTotal = function(deptName,total) {
  let query = 'SELECT ProductSales FROM Departments WHERE DepartmentName = ?';
  let params = deptName;
  connection.query(query, params, function(err, res) {
    updateTotal(res,deptName,total);
  });
};

let updateTotal = function(res,deptName,total) {
  let prodSales = res[0].ProductSales + total;
  let query = 'UPDATE Departments SET ProductSales = ? WHERE DepartmentName = ?';
  let params = [prodSales,deptName];
  connection.query(query, params, function(err, res) {
    connection.end();
  });
};

