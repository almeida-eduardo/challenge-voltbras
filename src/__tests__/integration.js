// Mock config file to set the number_pages configuration
jest.mock('../config');

const {createTestClient} = require('apollo-server-testing');
const gql = require('graphql-tag');

const {constructTestServer} = require('./__utils');

// the mocked REST API data
const {mockPlanetsResponse} = require('../datasources/__tests__/planet');
// Mock db file with results
jest.mock('../datasources/db', () => ({
    stationFind: jest.fn()
        .mockReturnValueOnce({ name: 'Marte'}) // first call
        .mockReturnValueOnce(null), // second call
    stationInstall: jest.fn()
        .mockReturnValueOnce(1) // first call
        .mockReturnValueOnce(-1) // second call
  }));

const GET_PLANETS = gql`
  query GetSuitablePlanets {
    suitablePlanets {
      name   
      mass
      hasStation
    }
  }
`;

const INSTALL_STATION = gql`
  mutation InstallStation($planetName: String!) {
    installStation(planetName: $planetName) {
      success
      message
    }
  }
`;

describe('Queries', () => {
  it('fetches list of planets', async () => {
    // create an instance of ApolloServer that mocks out context, while reusing
    // existing dataSources, resolvers, and typeDefs.
    // This function returns the server instance as well as our dataSource
    // instances, so we can overwrite the underlying fetchers
    const {server, planetAPI} = constructTestServer();

    // mock the datasources' underlying fetch methods, whether that's a REST
    // lookup in the RESTDataSource or the store query in the Sequelize datasource
    planetAPI.get = jest.fn(() => mockPlanetsResponse);

    // use our test server as input to the createTestClient fn
    // This will give us an interface, similar to apolloClient.query
    // to run queries against our instance of ApolloServer
    const {query} = createTestClient(server);
    const res = await query({query: GET_PLANETS});
    expect(res).toMatchSnapshot();

  });

});

describe('Mutations', () => {

  it('install station in planet', async () => {
    const {server, stationAPI} = constructTestServer();

    const {mutate} = createTestClient(server);
    const res = await mutate({
      mutation: INSTALL_STATION,
      variables: {planetName: "Marte"},
    });
    expect(res).toMatchSnapshot();
  });
  
});
