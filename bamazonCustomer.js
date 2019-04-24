const pool = require('./initmysql');
const inquirer = require('inquirer');

process.stdout.write("Loading products..");
mainAsync();


async function  mainAsync(){
    const loader = setInterval(() => {
        process.stdout.write(".")
    }, 500);
    const allProducts = await queryAll();
    clearInterval(loader);
    if(allProducts){
        process.stdout.write('\nAvailable products: \n');
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
            process.stdout.write("Purchasing..");
            const loader = setInterval(() => {
                process.stdout.write(".")
            }, 500);
            await purchaseProduct(answers.userChoice,purchaseAmount);
            clearInterval(loader);
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



function queryAll(){
    return new Promise(async(res,rej)=>{
        try{
            results = await pool.query('SELECT * FROM ?? ',"products")
            res(results);
        }catch(err){
            console.error(err);
            rej(err);
        }
        
    })
}

function purchaseProduct(item_id,quantity){
    return new Promise(async (resolve,reject)=>{
        const connection = await pool.getConnection();
        //TODO promisify
        connection.beginTransaction(function(err) {
            if (err) { reject(err); }
            connection.query('SELECT * FROM ?? WHERE ? LIMIT 1', ["products",{item_id:item_id}], function (error, results, fields) {
                if (error) {
                    resolve (connection.rollback(function() {
                    reject(error);
                    }));
                }
                
                let q = connection.query('UPDATE ?? SET ? WHERE ?', ["products",{stock_quantity:results[0].stock_quantity - quantity},{item_id:item_id}], function (error, results, fields) {
                if (error) {
                    console.log(q.sql);
                    
                    resolve (connection.rollback(function() {
                        reject(error);
                    }));
                }
                
                connection.commit(function(err) {
                    if (err) {
                        resolve (connection.rollback(function() {
                        reject(err);
                        }));
                    }
                    connection.end();
                    resolve(true);
                    
                });
              });
            });
          });
          
    })
}

