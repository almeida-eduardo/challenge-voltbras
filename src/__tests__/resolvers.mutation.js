const resolvers = require('../resolvers');

const mockContext = {
  dataSources: {
    stationAPI: {
        installStation: jest.fn(),
    },
  },
};

describe('[Mutation.installStation]', () => {
  const { installStation } = mockContext.dataSources.stationAPI;

  it('returns true if station install succeeds', async () => {
    installStation.mockReturnValueOnce( 1 );

    // check the resolver response
    const res = await resolvers.Mutation.installStation(
      null,
      { planetName: 'Marte' },
      mockContext,
    );

    expect(res.message).toEqual('estação instalada com sucesso');
    expect(res.success).toBeTruthy();

    // check if the dataSource was called with correct args
    expect(installStation).toBeCalledWith('Marte');
  });

  it('returns false if station install fails', async () => {
    installStation.mockReturnValueOnce( 0 );

    // check the resolver response
    const res = await resolvers.Mutation.installStation(
      null,
      { planetName: 'Marte' },
      mockContext,
    );

    expect(res.message).toEqual('a estação não pôde ser instalada no planeta \'Marte\'');
    expect(res.success).toBeFalsy();
  });

  it('returns false if station is already installed', async () => {
    installStation.mockReturnValueOnce( -1 );

    // check the resolver response
    const res = await resolvers.Mutation.installStation(
      null,
      { planetName: 'Marte' },
      mockContext,
    );

    expect(res.message).toEqual('a estação já está instalada no planeta \'Marte\'');
    expect(res.success).toBeFalsy();
  });

  it('returns false if planetName param is empty or not provided', async () => {
    installStation.mockReturnValueOnce( -1 );

    // check the resolver response
    const res = await resolvers.Mutation.installStation(
      null,
      { },
      mockContext,
    );

    expect(res.message).toBeDefined();
    expect(res.success).toBeFalsy();
  });

});
