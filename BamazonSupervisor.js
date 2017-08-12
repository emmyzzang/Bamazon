// NODE DRIVERS ZOOM ZOOM 
let mysql = require('mysql'); 
let inquirer = require('inquirer'); 
let accounting = require('accounting'); 
let chalk = ('chalk'); 
let Bamazon = require('./BamazonAccounting'); 

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
	start(); 
});

// Allow user to choose from menu options
var start = function() {
  console.log('');
	inquirer.prompt([
	  {
	    type: 'list',
	    name: 'menu',
	    message: 'What would you like to do?',
	    choices: [
	    	'1) View Products Sales by Department',
	    	'2) Create New Department'
	    ]
	  }
	]).then(function (answers) {
	  switch(answers.menu) {
	  	case '1) View Products Sales by Department': viewProducts(); break;
	  	case '2) Create New Department': createDept(); break;
	  }
	});
};

// Select columns you want to show
let col = ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales','Total Profit'];

// Query
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
	let query = "SELECT \
	DepartmentID AS 'Department ID',\
    DepartmentName AS 'Department Name',\
    OverheadCosts AS 'Overhead Costs',\
    ProductSales AS 'Product Sales',\
    ProductSales-OverheadCosts AS 'Total Profit'\
	FROM Departments";
	sendQuery(query,printStart);
};

// Function for handling new department creation
let createDept = function() {
	// Callback once answers are entered
	let insertQuery = function(answers) {
		let query = 'INSERT INTO Departments (DepartmentName,OverHeadCosts) VALUES (?,?)';
		let formatPrice = accounting.formatMoney(answers.overhead, "", 2, "",".");
		let params = [answers.deptname, formatPrice];
		sendQuery(query,confirmed,params);
	}
	// Callback once stock quantity is updated
	let confirmed = function(res) {
		console.log(chalk.bold.blue('\nCompleted adding additional department!'));
		// Reshow menu
		start();
	}
	// Questions that call the functions listed above
	inquirer.prompt([{
    name: "deptname",
    type: "input",
    message: "What is the name of the department you would like to add?"
  } , {
    name: "overhead",
    type: "input",
    message: "What is the overhead costs of the department?",
    validate: Bamazon.validateMoney
  }]).then(insertQuery);
};