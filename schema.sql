CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS products(
item_id INT UNIQUE AUTO_INCREMENT PRIMARY KEY,
product_name VARCHAR(200) NOT NULL,
department_name VARCHAR(100),
price DECIMAL(8,2),
stock_quantity INT NOT NULL
)

INSERT INTO products(product_name,department_name,price,stock_quantity)
VALUES ('macbook','electronics',2500.00,20)

select * from products


