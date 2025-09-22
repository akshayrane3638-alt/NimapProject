const sql = require('mssql');

const config = {
    user: 'sa', // update as needed
    password: 'Akr@143', // update as needed
    server: 'AKSHAY07\\AKR', // update as needed
    database: 'inventory_db', // update as needed
    options: {
        encrypt: false, // for local dev
        trustServerCertificate: true
    }
};

let poolPromise = null;

async function connectToMSSQL() {
    if (!poolPromise) {
        try {
            poolPromise = await sql.connect(config);
            console.log('Connected to MSSQL');
            return true;
        } catch (err) {
            console.error('MSSQL Connection Error:', err);
            poolPromise = null;
            return false;
        }
    }
    return true;
}

module.exports = {
    sql,
    connectToMSSQL,
    getPool: () => poolPromise
};
