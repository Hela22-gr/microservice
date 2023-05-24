const { gql } = require('@apollo/server');
// Définir le schéma GraphQL
const typeDefs = `#graphql
    type Plat {
        id: String!
        title: String!
        description: String!
    }
    type Regime {
        id: String!
        title: String!
        description: String!
    }
    type Query {
        plat(id: String!): Plat
        plats: [Plat]
        regime(id: String!): Regime
        regimes: [Regime]
        getPlat(title: String!, description: String!): Plat
        getRegime(title: String!, description: String!): Regime

    }
    type Mutation {
        createPlat(title: String!, description: String!): Plat
        createRegime(title: String!, description: String!): Regime
    }
`;
module.exports = typeDefs