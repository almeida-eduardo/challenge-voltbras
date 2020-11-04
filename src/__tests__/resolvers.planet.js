const resolvers = require('../resolvers');

describe('[Planet.hasStation]', () => {
  const mockContext = {
    dataSources: {
      stationAPI: { isStationInstalled: jest.fn() },
    },
  };
  const planet = { 
      name: "Marte",
  };
  const { isStationInstalled } = mockContext.dataSources.stationAPI;

  it('uses planet to lookup if has station installed', async () => {
    isStationInstalled.mockReturnValueOnce(true);

    // check the resolver response
    const res = await resolvers.Planet.hasStation(planet, null, mockContext);
    expect(res).toEqual(true);

    // make sure the dataSources were called properly
    expect(isStationInstalled).toBeCalledWith( "Marte" );
  });

  it('returns false if no response or station not installed ', async () => {
    isStationInstalled.mockReturnValueOnce(false);

    // check the resolver response
    const res = await resolvers.Planet.hasStation(planet, null, mockContext);
    expect(res).toEqual(false);

    // make sure the dataSources were called properly
    expect(isStationInstalled).toBeCalledWith( "Marte" );
  });

  it('returns false if planet is empty or planet name is empty  ', async () => {
    isStationInstalled.mockReturnValueOnce(false);

    // check the resolver response
    const res = await resolvers.Planet.hasStation(null, null, mockContext);
    expect(res).toEqual(false);

  });
});
