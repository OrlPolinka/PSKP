const sql = require('mssql');

let config = {
    user: 'student',
    password: 'fitfit',
    server: 'localhost',
    database: 'OPV',
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 1,
        idleTimeoutMillis: 30000
    }
};

let poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('MSSQL connected');
        return pool;
    })
    .catch(err => {
        console.error('MSSQL connection error: ' + err.message);
        throw err;
    });

module.exports = {sql, poolPromise};