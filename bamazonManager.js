const inquirer = require('inquirer');

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
        case options[1]:
        case options[2]:
        case options[3]:
        case default:
    }
}













