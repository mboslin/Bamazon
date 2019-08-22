CREATE DATABASE bamazon;
USE bamazon;

DROP TABLE products;

CREATE TABLE products (
item_id INTEGER(10) NOT NULL auto_increment,
product_name VARCHAR(100),
department_name VARCHAR(50),
price DECIMAL(20,2),
stock_quantity INTEGER(20),
PRIMARY KEY(item_id)
);

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (01, "iPhoneXS MAX", "Electronics", 1099.00, 20),
(02, "Heavenly Hunks", "Food", 12.00, 100),
(03, "LV Wallet", "Fashion", 200.00, 6),
(04, "Outdoor Fan", "Home Improvement", 40.00, 10),
(05, "AirPods", "Electronics", 159.00, 320),
(06, "Apple Watch", "Electronics", 399.00, 20),
(07, "Harry Potter", "Books", 12.79, 100),
(08, "Moby Dick", "Books", 14.50, 50),
(09, "Toaster Oven", "Appliance", 32.00, 12),
(10, "Paper", "Stationary", 2.00, 300);