const inquirer = require('inquirer');

var initmysql = require('./initmysql.js');
var pool = initmysql.pool;
var queryAll = initmysql.queryAll;
const changeQuantityForProduct = initmysql.changeQuantityForProduct;

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




function queryLowInventory(lowQuantity){
    return new Promise(async(res,rej)=>{
        try{
            results = await pool.query('SELECT * FROM ?? WHERE stock_quantity<?',["products",lowQuantity])
            res(results);
        }catch(err){
            console.error(err);
            rej(err);
        }
        
    })
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





