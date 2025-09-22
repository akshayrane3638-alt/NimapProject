
const express = require('express');
const port = 8000;
const app = express();
app.use(express.json());
const cors = require('cors');

app.use(cors());

const { connectToMSSQL } = require('./DbConnection/mssqlConnection');
const route = require('./src/routes/routes');
app.use('/', route);

async function startServer() {
    const connected = await connectToMSSQL();
    if (connected) {
        app.listen(port, () => {
            console.log("Server listening on port 8000");
        });
    } else {
        console.error('Failed to connect to MSSQL. Server not started.');
    }
}

startServer();