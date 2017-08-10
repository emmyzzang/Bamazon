
// NODE DRIVERS ZOOM ZOOM 
const mysql = require("mysql"); 
const inquirer = require("inquirer");
const accounting = require("accounting"); 
const chalk = require("chalk");
const Table = require('cli-table');

// MYSQL CONNECT 
let connection = mysql.createConnection({
	host: 'localhost', 
	port: 3306,
	user: 'root', 
	password: '', 
	database: 'Bamazon'
}); 

connection.connect(function(err) {
	if (err) throw err; 
	console.log('Your database requires additional pylons!');
	start(); 
}); 

let max, col = ['Item ID', 'Product Name', 'Price'];

let start = function () {
	let query = Bamazon.createQuery(col); 
	connection.query(query, function(err, res) {
		handleQuery(res); 
	}); 
}; 

let handleQuery = function(res) {
	Bamazon.printData(res, col); 
	Bamazon.printData(res,col);
  	max = res[res.length - 1]['Item ID'];
    chooseItem(max);
};

let chooseItem = function(max) {
	inquirer
		.prompt({[
			name: "id", 
			type: "input", 
			message: "What is the Item ID of the product you would like to buy?", 
			validate: function(value) {
     			if (value>=0 && value<=max && value%1 === 0 && value.indexOf(' ')<0 && value.indexOf('.')<0) {
        		return true;
     			} else {
        		return 'Please type a whole number between 1 and ' + max + ' no extra characters or spaces';
		     	}
		   	}
		  } , {
				name: "quantity", 
				type: "input", 
				message: "How many units would you like to buy?", 
				validate: Bamazon.validateQuantity
				]}).then(function(answer) {
					checkQuantity(answer);
				}); 
			};

// let checkQuantity = function(answer) {
// 	let query = 'SELECT '
// }





