const inquirer = require('inquirer');
const { green, inverse, bgLightCyan, underline, dim } = require ('ansicolor')
const asTable = require ('as-table').configure ({ title: x => x.bgLightCyan, delimiter: ' | '.dim.cyan, dash: '-'.dim.cyan })

const mysqlutils = require('./mysqlutils.js')
, pool = mysqlutils.pool
, queryAll = mysqlutils.queryAll
, changeQuantityForProduct = mysqlutils.changeQuantityForProduct
, setLoader = mysqlutils.setLoader
, cancelLoader = mysqlutils.cancelLoader
, changeSalesForProduct = mysqlutils.changeSalesForProduct
, salesByDepartment = mysqlutils.salesByDepartment;


mainAsync();

async function  mainAsync(){
    const options = ["View Product Sales by Department","Create New Department"];
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
            loader = setLoader("Loading all department");
            const allProducts = await salesByDepartment();
            cancelLoader(loader);
            
            
            
            console.log (asTable (allProducts));

            break;
        case options[1]:
            
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