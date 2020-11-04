// Mock db file with results
jest.mock('../db');

const StationAPI = require('../station');

const ds = new StationAPI();

describe('[StationAPI.installStation]', () => {
  it('calls installStation and returns result', async () => {
    // check the result of the fn
    const res = await ds.installStation("Marte");
    expect(res).toBeTruthy();

  });

});

describe('[StationAPI.isStationInstalled]', () => {
  it('calls isStationInstalled and returns result', async () => {
    // check the result of the fn
    const res = await ds.isStationInstalled("Marte");
    expect(res).toBeTruthy();

  });
});
