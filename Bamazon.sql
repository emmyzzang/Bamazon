CREATE DATABASE Bamazon; 
USE Bamazon; 

CREATE TABLE Products (
ItemID INT (10) UNSIGNED AUTO_INCREMENT NOT NULL, 
ProductName VARCHAR (255) NOT NULL, 
DepartmentName VARCHAR (255) NOT NULL, 
Price DECIMAL (10, 2) NOT NULL, 
StockQuantity SMALLINT UNSIGNED NOT NULL, 
PRIMARY KEY (ItemID)
);

INSERT INTO (ProductName, DepartmentName, Price, StockQuantity) 

VALUES 

	('Playstation 4','Electronics',250.00,5000),
    ('Bloodborne','Electronics',19.99,2000),
    ('Assassins Creed Origins','Electronics',59.99,2000),
    ('Need For Speed Rivals','Electronics',19.99,2000),
    ('Fallout 4','Electronics',29.99,2000),
    ('Tesla S','Vehicles',75000.00,1000),
    ('Toyota Prius Prime','Vehicles',33000.00,1000),
    ('Hyundai Elantra','Vehicles',18500.00,1000),
    ('Mini Cooper','Vehicles',25000.00,1000),
    ('Kia Soul','Vehicles',17700.00,100);
