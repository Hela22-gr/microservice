const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql2');

const regimeProtoPath = 'regime.proto';
const regimeProtoDefinition = protoLoader.loadSync(regimeProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const regimeProto = grpc.loadPackageDefinition(regimeProtoDefinition).regime;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_lala',
});

const regimeService = {
    getRegime: (call, callback) => {
        const { regime_id } = call.request;
        const query = 'SELECT * FROM regime WHERE id = ?';
        const values = [id];

        pool.query(query, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const regime = results[0];
                callback(null, { regime });
            }
        });
    },
    searchRegime: (call, callback) => {
        const { query } = call.request;
        const searchQuery = 'SELECT * FROM regime WHERE title LIKE ?';
        const values = [`%${query}%`];

        pool.query(searchQuery, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const regimes = results;
                callback(null, { regimes });
            }
        });
    },
    createRegime: (call, callback) => {
        const { title, description } = call.request;
        const query = 'INSERT INTO regime (title, description) VALUES (?, ?)';
        const values = [title, description];

        pool.query(query, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const insertedId = results.insertId;
                const regime = { id: insertedId, title, description };
                callback(null, { regime });
            }
        });
    },
};

const server = new grpc.Server();
server.addService(regimeProto.RegimeService.service, regimeService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind the server:', err);
        return;
    }
    console.log(`The server is running on port ${port}`);
    server.start();
});

console.log(`Regime microservice is running on port ${port}`);
