const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mysql = require('mysql2');

const platProtoPath = 'plat.proto';

const platProtoDefinition = protoLoader.loadSync(platProtoPath, {
    keepCase: true,
    longs: String,  
    enums: String,
    defaults: true,
    oneofs: true,
});


const platProto = grpc.loadPackageDefinition(platProtoDefinition).plat;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_lala',
});

const platService = {
    getPlat: (call, callback) => {
        const { plat_id } = call.request;
        const query = 'SELECT * FROM plat WHERE id = ?';
        const values = [plat_id];

        pool.query(query, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const plat = results[0];
                callback(null, { plat });
            }
        });
    },
    searchPlat: (call, callback) => {
        const { query } = call.request;
        const searchQuery = 'SELECT * FROM plat WHERE title LIKE ?';
        const values = [`%${query}%`];

        pool.query(searchQuery, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const plats = results;
                callback(null, { plats });
            }
        });
    },
    createPlat: (call, callback) => {
        const { title, description } = call.request;
        const query = 'INSERT INTO plat (title, description) VALUES (?, ?)';
        const values = [title, description];

        pool.query(query, values, (error, results) => {
            if (error) {
                callback(error);
            } else {
                const insertedId = results.insertId;
                const plat = { id: insertedId, title, description };
                callback(null, { plat });
            }
        });
    },
};

const server = new grpc.Server();
server.addService(platProto.PlatService.service, platService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to bind the server:', err);
        return;
    }
    console.log(`The server is running on port ${port}`);
    server.start();
});

console.log(`plat microservice is running on port ${port}`);

