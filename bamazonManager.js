const inquirer = require('inquirer');

const mysqlutils = require('./mysqlutils.js')
, pool = mysqlutils.pool
, queryAll = mysqlutils.queryAll
, changeQuantityForProduct = mysqlutils.changeQuantityForProduct
, queryLowInventory = mysqlutils.queryLowInventory
, addNewProductToDB = mysqlutils.addNewProductToDB
, setLoader = mysqlutils.setLoader
, cancelLoader = mysqlutils.cancelLoader;


mainAsync();

async function  mainAsync(){
    const options = ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"];
    let loader;
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
            loader = setLoader("Loading all products");
            const allProducts = await queryAll();
            cancelLoader(loader);

            process.stdout.write('Available products: \n');
            console.table(allProducts);
            break;
        case options[1]:
            loader = setLoader("Loading prducts with low inventory");
            const lowQuantityItems = await queryLowInventory(5);
            cancelLoader(loader);

            console.table(lowQuantityItems);
            break;
        case options[2]:
            await addMoreInventory();
            break;
        case options[3]:
            await addNewProduct();
            break;
        default:
            break;
    }
    const confirm = await inquirer
        .prompt([
            {
            message:"Would you like to perform more actions?",
            type:"confirm",
            name:"more"
            }
        ]);
    if(confirm.more){
        mainAsync();
    }else{
        console.log("Goodbye!");
        pool.end();
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