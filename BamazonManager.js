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
	console.log('Your database requires additional pylons!');
	start(); 
}); 