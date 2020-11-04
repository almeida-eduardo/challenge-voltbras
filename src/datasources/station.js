const { DataSource } = require('apollo-datasource');
const {stationFind, stationInstall} = require('./db.js')

class StationAPI extends DataSource {
    constructor() {
        super();
    }

  async installStation(planetName) {
      try {
          const result = await stationInstall(planetName);
          return result;
      } catch (error) {
          console.log('error', error);
        return 0;          
      }
  }

  async isStationInstalled( planetName) {
    const found = await stationFind(planetName);

    return found != null;
  }

}

module.exports = StationAPI;