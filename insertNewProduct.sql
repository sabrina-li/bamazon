DROP PROCEDURE IF EXISTS `insertNewProduct`;

CREATE PROCEDURE `insertNewProduct`(
IN productName VARCHAR(200),
IN departmentName VARCHAR(100),
IN price DECIMAL(8,2),
IN stockQuantity INT
)
BEGIN
	DECLARE d_id INT;

	SELECT department_id INTO d_id 
	FROM departments d
	WHERE d.department_name = departmentName
	LIMIT 1;
	
	IF d_id IS NULL THEN
		SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Can not find department';
   END IF;

	INSERT INTO products(product_name,department_id,price,stock_quantity)
	VALUES (productName,d_id,price,stockQuantity);
END;