# Bamazon

This is a command line based Amazon-like storefront/inventory system run on NodeJs and MySQL.

The system has three interfaces:

Customer - Allow customer to view products and take in orders from customers, verify stock quantities, calculate price, and deplete stock from the store's inventory.  

Manager - Allow store managers to view products, restock specific products, and add new product to existing department.

Supervisor - Allow supervisor to track product sales across your store's departments and then provide a summary of the highest-grossing departments in the store.


## Getting Started
------
run `npm i` to install dependencies

spin up MySQL server and run `schema.sql` to create schema

Add your MySQL information to `mysqlutils.js`:

```
const pool = mysql.createPool({
    connectionLimit: 10,
    host     : 'localhost',
    port     : 8889,
    user     : 'root',
    password : 'root',
    database : 'bamazon'
});
```

run `seed.sql` to fill products and departments table data or create your own product/departments data

run `insertNewProduct.sql` to create required stored procedure

You are good to go!

## Usage
------

- Customer View:


    `node bamazonCustomer.js` Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

    Users will then get prompted the following:

    - The ID of the product they would like to buy. (validate input to be only valid ID)

    - How many units of the product they would like to buy.



    Once the customer has placed the order, the app will check if the store has enough of the product to meet the customer's request.

    If not, customer will recieve `Insufficient quantity!`, and order will not go through.


    If the store does have enough of the product, then fulfill the customer's order by updating the SQL database to reflect the remaining quantity. Once the update goes through, the customer is shown the total cost of their purchase.
    ![alt text](./readmefiles/BC.gif "customers")

------

- Manager View:

  `node bamazonManager.js`  Running this application will list a set of menu options:
    
    ```
    View Products for Sale

    View Low Inventory

    Add to Inventory

    Add New Product  
    ```


    If a manager selects View Products for Sale, the app will list every available item: the item IDs, names, prices, and quantities.
    ![alt text](./readmefiles/manager-1.gif "manager view products for sale")


    If a manager selects View Low Inventory, the app will list all items with an inventory count lower than 5.
    ![alt text](./readmefiles/manager-2.gif "manager view View Low Inventory")

    If a manager selects Add to Inventory, the app will display a prompt that will let the manager "add more" of any item currently in the store.
    ![alt text](./readmefiles/manager-3.gif "manager view Add to Inventory")


    If a manager selects Add New Product, the app will allow the manager to add a completely new product to a existing department.
    ![alt text](./readmefiles/manager-4.gif "manager view Add New Product")




------

- Supervisor View:

    `node bamazonSupervisor.js ` Running this application will list a set of menu options:
    ```
    View Product Sales by Department

    Create New Department
    ```

    When a supervisor selects View Product Sales by Department, the app will display a summarized table for the department. where total_profit is calculated on the fly using the difference between over_head_costs and product_sales. Sample Table shown below:


    | department_id | department_name | over_head_costs | product_sales | total_profit |
    | ------------- | --------------- | --------------- | ------------- | ------------ |
    | 01            | Electronics     | 10000           | 20000         | 10000        |
    | 02            | Clothing        | 60000           | 100000        | 40000        |

    ![alt text](./readmefiles/superviser-1.gif "Supervisor View Product Sales")

    When a supervisor selects Create New Department, the app will ask for department name and overhead cost, then create a new department
    ![alt text](./readmefiles/superviser-2.gif "Supervisor Create New Department")