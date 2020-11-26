const {gql} = require('apollo-server');
const typeDefs = gql`
    type Planet {
        name: String!
        mass: Float!
        unit: String!
        hasStation: Boolean #poderia ser obrigatório "!", não?
    }

    type installResponse { #por que começar com minúsculo?
        success: Boolean!
        message: String
    }    

    type Query {
        suitablePlanets: [Planet]!
    }

    type Mutation {
        installStation(planetName: String!): installResponse # esse retorno também poderia ser obrigatório "!" não?
    }
`;

module.exports = typeDefs;