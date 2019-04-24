const inquirer = require('inquirer');

const initmysql = require('./initmysql.js');
const pool = initmysql.pool;
const queryAll = initmysql.queryAll;
const changeQuantityForProduct = initmysql.changeQuantityForProduct;
const queryLowInventory = initmysql.queryLowInventory;
const addNewProductToDB = initmysql.addNewProductToDB;

mainAsync();

async function  mainAsync(){
    const options = ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"];

    const answers = await inquirer
        .prompt([
            {
            message:"What would you like to do?",
            type:"list",
            name:"userChoice",
            choices:options
            }
        ]);
    switch (answers.userChoice){
        case options[0]:
            const allProducts = await queryAll();
            process.stdout.write('Available products: \n');
            console.table(allProducts);
            break;
        case options[1]:
            const lowQuantityItems = await queryLowInventory(5);
            console.table(lowQuantityItems);
            break;
        case options[2]:
            addMoreInventory();
            break;
        case options[3]:
            addNewProduct();
            break;
        default:
            break;
    }
}







async function addMoreInventory(){
    const allProducts = await queryAll();

    console.log();
    const answers= await inquirer
        .prompt([
            {
            message:"What product would you like to add inventory?",
            type:"list",
            name:"userChoice",
            choices:allProducts.map(item=>"item_id: "+item.item_id+", "+item.product_name+': '+item.stock_quantity)
            },
            {
                message:"How many would you like to add?",
                type:"input",
                name:"addQuantity",
                validate: input => {return !isNaN(parseInt(input))}
            }
    ]);
    const item_id = answers.userChoice.slice(9).split(',')[0];
    
    await changeQuantityForProduct (item_id,-parseInt(answers.addQuantity));
    console.log("successfully added!")
}





async function addNewProduct(){
    const answers= await inquirer
        .prompt([
            {
            message:"What is the name of the product would you like to add?",
            type:"input",
            name:"productName",
            validate: input => {return input.length <= 200}
            },
            {
                message:"What department does this product belong to?",
                type:"input",
                name:"departmentName",
                validate: input => {return input.length <= 100}
            },
            {
                message:"What's the price of this item?",
                type:"input",
                name:"price",
                validate: input => {return input<=999999.99 && input >=0}
            },
            {
                message:"How many would you like to add?",
                type:"input",
                name:"stockQuantity",
                validate: input => {return !isNaN(parseInt(input))}
            }
    ]);
    await addNewProductToDB(answers.productName,answers.departmentName,answers.price,answers.stockQuantity)
    console.log("Added Successfully!")

}