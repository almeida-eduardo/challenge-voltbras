const {ApolloServer} = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const PlanetAPI = require('./datasources/planet');
const StationAPI = require('./datasources/station');

// set up any dataSources our resolvers need
const dataSources = () => ({
    planetAPI: new PlanetAPI(),
    stationAPI: new StationAPI()
});

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources
});

server.listen().then(({url}) => {
    // sobre o ponto que falei do binding 8080:4000
    // fica ainda mais estranho porque nos logs ele fala "Server ready at 4000", e na verdade ta na 8080
    console.log(`Server ready at ${url}`);
});

// export all the important pieces for integration/e2e tests to use
module.exports = {
    dataSources,
    typeDefs,
    resolvers,
    ApolloServer,
    PlanetAPI,
    StationAPI,
    server,
  };