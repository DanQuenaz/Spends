const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senha123',
    database: 'DB_SPENDING_TOGETHER',
    multipleStatements: true
});

db.connect(function(err){
    if(!!err){
        (err)
    }
});

module.exports = db;