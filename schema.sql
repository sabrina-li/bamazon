CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS products(
item_id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(200) NOT NULL,
department_name VARCHAR(100),
price DECIMAL(8,2),
stock_quantity INT NOT NULL
);

CREATE TABLE IF NOT EXISTS departments(
department_id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(100) NOT NULL,
over_head_costs INT NOT NULL
);

ALTER TABLE products
ADD COLUMN product_salesE INT NOT NULL;
