// NODE DRIVERS ZOOM ZOOM 
const mysql = require("mysql"); 
const inquirer = require("inquirer");
const accounting = require("accounting"); 
const chalk = require("chalk");
const Table = require('cli-table');
const Bamazon = require('./BamazonAccounting');

// DB CONFIG 
let connection = mysql.createConnection({
	host: 'localhost', 
	port: 3306,
	user: 'root', 
	password: '', 
	database: 'Bamazon'
}); 

connection.connect(function(err) {
	if (err) throw err; 
	console.log('The only reason anyone would do this, if they could, which they cant, would be because they could, which they cant.');
	start(); 
});

// Allow user to choose from menu options
let start = function() {
  console.log('');
	inquirer.prompt([
	  {
	    type: 'list',
	    name: 'menu',
	    message: 'What would you like to do?',
	    choices: [
	    	'1) View Products for Sale',
	    	'2) View Low Inventory',
	    	'3) Add to Inventory',
	    	'4) Add New Product'
	    ]
	  }
	]).then(function (answers) {
	  switch(answers.menu) {
	  	case '1) View Products for Sale': viewProducts(); break;
	  	case '2) View Low Inventory': viewLowInvent(); break;
	  	case '3) Add to Inventory': addInvent(); break;
	  	case '4) Add New Product': addProducts(); break;
	  }
	});
};

// Select columns to show 
let col = ['Item ID', 'Product Name', 'Price', 'Stock Quantity'];

// Query the db and get the res 
let sendQuery = function(query,callback,params) {
	connection.query(query, params, function(err, res) {
    callback(res);
  });
}

// Prints the data and restarts after receiving data from query
let printStart = function(res) {
	Bamazon.printData(res,col);
  // Reshow menu
	start();
}

// Function for handling view products option
let viewProducts = function() {
	// Query for selecting all rows of certain columns
	let query = Bamazon.createQuery(col);
	sendQuery(query,printStart);
};

// Function for handling view low inventory option
let viewLowInvent = function() {
	let query = Bamazon.createQuery(col);
// Query append to list all items with an inventory count lower than 5 
	query += ' WHERE StockQuantity < 5';
	sendQuery(query,printStart);
};

// Function for handling view add inventory option
let addInvent = function() {
	let inputQuantity;
	// Callback for after inquirer questions are asked
	let searchID = function(answers) {
  	let query = Bamazon.createQuery(col);
		query += ' WHERE ItemID = ?';
		inputQuantity = Number(answers.quantity);
		sendQuery(query,updateQuantity,answers.id);
  };
  // Calback after query of id is done
	let updateQuantity = function(res) {
		let quantity = res[0]['Stock Quantity'] + inputQuantity;
		let query = 'UPDATE Products SET StockQuantity = ? WHERE ItemID = ?';
		let params = [quantity,res[0]['Item ID']];
		sendQuery(query,confirmed,params);
	};
	// Callback once stock quantity is updated
	let confirmed = function(res) {
		console.log(chalk.bold.blue('\nCompleted adding stock to item!'));
		// Reshow menu
		start();
	}
	// Questions that call upon the functions listed above
	inquirer.prompt([{
    name: "id",
    type: "input",
    message: "What is the item ID of the product you would like to add stock?",
    validate: Bamazon.validate
  } , {
    name: "quantity",
    type: "input",
    message: "How many would you like to add?",
    validate: Bamazon.validate
  }]).then(searchID);
};

// Function for handling add products option
let addProducts = function() {
	// Callback once answers are entered
	let insertQuery = function(answers) {
		let query = 'INSERT INTO Products (ProductName,DepartmentName,Price,StockQuantity) VALUES (?,?,?,?)';
		let formatPrice = accounting.formatMoney(answers.price, "", 2, "",".");
		let params = [answers.name, answers.deptname, formatPrice, Number(answers.quantity)];
		sendQuery(query,confirmed,params);
	}
	// Callback once stock quantity is updated
	let confirmed = function(res) {
		console.log(chalk.bold.blue('\nCompleted adding additional item!'));
		// Reshow menu
		start();
	}
	// Questions that call the functions listed above
	inquirer.prompt([{
    name: "name",
    type: "input",
    message: "What is the name of the product you would like to add?"
  } , {
    name: "deptname",
    type: "input",
    message: "What is the department name of the product?"
  } , {
    name: "price",
    type: "input",
    message: "What is the price of the product?",
    validate: Bamazon.validateMoney
  } , {
    name: "quantity",
    type: "input",
    message: "What is the stock quantity of the product?",
    validate: Bamazon.validateQuantity
  }]).then(insertQuery);
};



