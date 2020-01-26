const mysql = require('mysql');
const { dbHost: host, dbName: database, dbPassword: password, dbUser: user } = require('../config/index');
const pool = mysql.createPool({
    connectionLimit: 20,
    host,
    database,
    user,
    password,
    timezone: 'UTC+0'
});

function connect() {
    return new Promise((resolve, reject) => {
        pool.getConnection((error, connection) => {
            if (error) {
                console.log(error);
                return reject(error)
            }
            resolve(connection);
        });
    });
}

module.exports = {
    connect
};