const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger les fichiers proto pour les films et les séries TV
const platProtoPath = 'plat.proto';
const regimeProtoPath = 'regime.proto';
const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Créer une nouvelle application Express
const app = express();
const platProtoDefinition = protoLoader.loadSync(platProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const regimeProtoDefinition = protoLoader.loadSync(regimeProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const platProto = grpc.loadPackageDefinition(platProtoDefinition).plat;
const regimeProto = grpc.loadPackageDefinition(regimeProtoDefinition).regime;
const clientPlats = new platProto.PlatService('localhost:50051', grpc.credentials.createInsecure());
const clientRegimes = new regimeProto.RegimeService('localhost:50052', grpc.credentials.createInsecure());

// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });

// Appliquer le middleware ApolloServer à l'application Express
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
server.start().then(() => {
    app.use(
        cors(),
        expressMiddleware(server),
    );
});

app.get('/plats', (req, res) => {
    const client = new platProto.PlatService('localhost:50051',
        grpc.credentials.createInsecure());
    const { q } = req.query;
    client.searchPlat({ query: q }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.plats);
        }
    });
});

app.post('/plat', (req, res) => {
    const { title, description } = req.body;
    clientPlats.createPlat({ title: title, description: description }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.plat);
        }
    });
});

app.get('/plats/:id', (req, res) => {
    const client = new platProto.PlatService('localhost:50051',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getPlat({ plat_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.plat);
        }
    });
});

app.get('/regime', (req, res) => {
    const client = new regimeProto.regimeService('localhost:50052',
        grpc.credentials.createInsecure());
    const { q } = req.query;
    client.searchregime({ query: q }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.regime);
        }
    });
});

app.post('/regime', (req, res) => {
    const { title, description } = req.body;
    clientRegimes.createRegime({ title: title, description: description }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.regime);
        }
    });
});

app.get('/regime/:id', (req, res) => {
    const client = new regimeProto.RegimeService('localhost:50052',
        grpc.credentials.createInsecure());
    const id = req.params.id;
    client.getRegime({ regime_id: id }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(response.regime);
        }
    });
});

// Démarrer l'application Express
const port = 3000;
app.listen(port, () => {
    console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});