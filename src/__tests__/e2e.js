// import our production apollo-server instance
const { server } = require('../');
const gql = require('graphql-tag');

const { startTestServer, toPromise } = require('./__utils');

const PLANETS_LIST_QUERY = gql`
  query listSuitablePlanets {
    suitablePlanets {
        name   
        mass
        hasStation
      }
  }
`;

describe('Server - e2e', () => {
  let stop, graphql;

  beforeEach(async () => {
    const testServer = await startTestServer(server);
    stop = testServer.stop;
    graphql = testServer.graphql;
  });

  afterEach(() => stop());

  it('gets list of planets', async () => {
    const res = await toPromise(
      graphql({
        query: PLANETS_LIST_QUERY,
      }),
    );

    expect(res).toMatchSnapshot();
  });

});
