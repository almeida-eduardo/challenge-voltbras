const {gql} = require('apollo-server');
const typeDefs = gql`
    type Planet {
        name: String!
        mass: Float!
        unit: String!
        hasStation: Boolean
    }

    type installResponse {
        success: Boolean!
        message: String
    }    

    type Query {
        suitablePlanets: [Planet]!
    }

    type Mutation {
        installStation(planetName: String!): installResponse
    }
`;

module.exports = typeDefs;