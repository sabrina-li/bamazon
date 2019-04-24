const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
    connectionLimit: 10,
    host     : 'localhost',
    port     : 8889,
    user     : 'root',
    password : 'root',
    database : 'bamazon'
});

pool.getConnection = util.promisify(pool.getConnection);
pool.query = util.promisify(pool.query);

  
module.exports = pool;