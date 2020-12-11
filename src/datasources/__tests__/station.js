// Mock db file with results
jest.mock('../db', () => ({
    stationFind: jest.fn()
        .mockReturnValueOnce({ name: 'Marte'}) // first call
        .mockReturnValueOnce(null), // second call
    stationInstall: jest.fn()
        .mockReturnValueOnce(1) // first call
        .mockReturnValueOnce(-1) // second call
  }));

const StationAPI = require('../station');

const ds = new StationAPI();

describe('[StationAPI.installStation]', () => {
  it('calls installStation for a station not installed and returns result', async () => {
    // check the result of the fn
    const res = await ds.installStation("Marte");
    expect(res).toBe(1);

  });
  
  it('calls installStation for a already installed station and returns result', async () => {
    // check the result of the fn
    const res = await ds.installStation("Marte");
    expect(res).toBe(-1);

  });
  

});

describe('[StationAPI.isStationInstalled]', () => {
  it('calls isStationInstalled for installed station and returns result', async () => {
    // check the result of the fn
    const res = await ds.isStationInstalled("Marte");
    expect(res).toBeTruthy();

  });
  it('calls isStationInstalled for a station not installed and returns result', async () => {
    // check the result of the fn
    const res = await ds.isStationInstalled("Marte");
    expect(res).toBeFalsy();

  });
});
