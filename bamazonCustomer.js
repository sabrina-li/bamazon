const pool = require('./initmysql');

process.stdout.write("Loading products..");
displayAllProduct();


async function displayAllProduct(){
    const loader = setInterval(() => {
        process.stdout.write(".")
    }, 500);
    const allProducts = await queryAll();
    clearInterval(loader);
    process.stdout.write('\n');
    console.table(allProducts);
}

function queryAll(){
    return new Promise((res,rej)=>{
        pool.query('SELECT * FROM ?? ',"products", function (error, results, fields) {
            if (error) rej(error);
            res(results);
          });
    })
    
}

