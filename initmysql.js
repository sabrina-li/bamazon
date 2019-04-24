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
  
module.exports.pool = pool;
module.exports.queryAll = queryAll;