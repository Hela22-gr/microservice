const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger les fichiers proto pour les films et les séries TV
const platProtoPath = 'plat.proto';
const regimeProtoPath = 'regime.proto';

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

// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
    Query: {
        plat: (_, { id }) => {
            // Effectuer un appel gRPC au microservice de films
            const client = new platProto.PlatService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getPlat({ plat_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.plat);
                    }
                });
            });
        },
        plats: () => {
            // Effectuer un appel gRPC au microservice de films
            const client = new platProto.PlatService('localhost:50051',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchPlats({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.plat);
                    }
                });
            });
        },

        regime: (_, { id }) => {
            // Effectuer un appel gRPC au microservice de séries TV
            const client = new regimeProto.RegimeService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.getRegime({ regime_id: id }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.regime);
                    }
                });
            });
        },

        regimes: () => {
            // Effectuer un appel gRPC au microservice de séries TV
            const client = new regimeProto.RegimeService('localhost:50052',
                grpc.credentials.createInsecure());
            return new Promise((resolve, reject) => {
                client.searchRegime({}, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.regimes);
                    }
                });
            });
        },
    },
    Mutation: {
        createPlat: (_, { id, title, description }) => {
            return new Promise((resolve, reject) => {
                clientPlats.createPlat({ plat_id: id, title: title, description: description }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.plat);
                    }
                });
            });
        },
        createRegime: (_, { id, title, description }) => {
            return new Promise((resolve, reject) => {
                clientRegimes.createRegime({ plat_id: id, title: title, description: description }, (err, response) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(response.regime);
                    }
                });
            });
        },
    }
};

module.exports = resolvers;