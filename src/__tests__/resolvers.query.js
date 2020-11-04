const resolvers = require('../resolvers');

describe('[Query.suitablePlanets]', () => {
  const mockContext = {
    dataSources: {
      planetAPI: { getAllPlanets: jest.fn() },
    },
  };
  // just for easy access
  const { getAllPlanets } = mockContext.dataSources.planetAPI;

  it('calls lookup from suitablePlanets api', async () => {
    getAllPlanets.mockReturnValueOnce([{ name: 'Marte', mass: 21, unit: 'M_jup', hasStation: false }]);

    // check the resolver response
    const res = await resolvers.Query.suitablePlanets(null, null, mockContext);
    expect(res).toEqual([{
      name: 'Marte',
      mass: 21,
      unit: 'M_jup',
      hasStation: false,
    }]);
  });

});
