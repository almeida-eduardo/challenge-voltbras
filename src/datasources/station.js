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
          // esse return 0 também não ficou muito daora, poderia dar o throw mesmo aqui
        return 0;          
      }
  }

  async isStationInstalled( planetName) {
    const found = await stationFind(planetName);
    // aqui ficou legal
    return found != null;
  }

}

module.exports = StationAPI;