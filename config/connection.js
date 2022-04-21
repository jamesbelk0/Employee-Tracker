require('dotenv').config()

const connection = mysql.createConnection({
    host: 'localhost',
    dialect: 'mysql',
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
});

module.export = connection
