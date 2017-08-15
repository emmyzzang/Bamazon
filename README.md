# Bamazon

Amazon-like store application utilizing a Unix Command Line Interface, Node.js, NPM drivers to control an Express Server, MySql Database, Accounting, and an Inquirer Prompt. 

This App allows customers, as well as managers and executives, to access product data, make purchases, check stock, and alter inventory.

The following features are included. 

On runtime initialization of the BamazonCustomer view, the Item ID, product name, and price of each product are displayed to the user. The user is prompted to enter the item ID of the product they would like to buy as well as how many units they would like to buy. 

<img src="images/AmazonCustomerView.png">

Once the user has placed the order, Bamazon checks if the store has enough of the product to meet the customer's request. If so, the Item's Price and Stock Quantity are updated accordingly. If not, the app logs the phrase, "Insufficient quantity!", and prevents the order from going through.

<img src="images/AmazonCustomer+Insufficient.png">

The Item ID, Department Name, Price, and Stock Quantity are maintained in Bamazon's database. The Bamazon database will be updated after purchases are completed. 
