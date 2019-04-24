const inquirer = require('inquirer');

const mysqlutils = require('./mysqlutils.js')
, pool = mysqlutils.pool
, queryAll = mysqlutils.queryAll
, changeQuantityForProduct = mysqlutils.changeQuantityForProduct
, queryLowInventory = mysqlutils.queryLowInventory
, addNewProductToDB = mysqlutils.addNewProductToDB
, setLoader = mysqlutils.setLoader
, cancelLoader = mysqlutils.cancelLoader

const inquirer = require('inquirer');


mainAsync();


async function  mainAsync(){
    let loader
    loader = setLoader("Loading all products");
    const allProducts = await queryAll();
    cancelLoader(loader);
    
    if(allProducts){
        process.stdout.write('Available products: \n');
        console.table(allProducts);

        const answers = await inquirer
            .prompt([
                {
                message:"What is the item_id that you would like to buy?",
                type:"input",
                name:"userChoice",
                validate: input => {
                        if( parseInt(input) && parseInt(input)<=allProducts.length){
                            return true;
                        }else{
                            return "Please enter intenger between 1 and "+allProducts.length;
                        }
                    }
                },
                {
                message:"how many units of the product they would like to buy?",
                type:"input",
                name:"numOfUnit",
                validate: input => {return !isNaN(parseInt(input))}
                }
            ])
        const selectedProduct = allProducts.find(element => element.item_id == answers.userChoice);
        const purchaseAmount = parseInt(answers.numOfUnit);
        if(selectedProduct.stock_quantity >= purchaseAmount){
            loader = setLoader("Purchasing");
            await changeQuantityForProduct(answers.userChoice,purchaseAmount);
            cancelLoader(loader);
            console.log("\nPurchase successful! Total cost of purchase: $",selectedProduct.price * purchaseAmount);
        }else{
            console.error("Insufficient quantity!")
        }
    }else{
        console.error ("0 Product found!");
    }
    const confirm = await inquirer
        .prompt([
            {
            message:"Would you like to buy more stuff?",
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








