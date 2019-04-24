const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 1,
    host     : 'localhost',
    port     : 8889,
    user     : 'root',
    password : 'root',
    database : 'bamazon'
});

pool.getConnection = util.promisify(pool.getConnection);
pool.query = util.promisify(pool.query);

function queryAll(){
  process.stdout.write("Loading products..");
  return new Promise(async(res,rej)=>{
      try{
          const loader = setInterval(() => {
            process.stdout.write(".")
          }, 500);
          results = await pool.query('SELECT * FROM ?? ',"products");
          clearInterval(loader);
          process.stdout.write("\n")
          res(results);
      }catch(err){
          console.error(err);
          rej(err);
      }
      
  })
}
  

function changeQuantityForProduct(item_id,quantity){
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
                  connection.release();
                  resolve(true);
                  
              });
            });
          });
        });
        
  })
}
module.exports.pool = pool;
module.exports.queryAll = queryAll;
module.exports.changeQuantityForProduct = changeQuantityForProduct;