const { MongoClient } = require("mongodb");
const config = require('../config');

getStationCollectionDB = async () => {
    // Use connect method to connect to the Server
    const client = await MongoClient.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    const database = client.db(config.db.databaseName);
    const stationCollection = database.collection(config.db.stationCollectionName);
    return {client, stationCollection};
}

module.exports.stationFind = async (planetName) => {
    
    const {client, stationCollection} = await getStationCollectionDB();

    const result = await stationCollection.findOne({ name: planetName });
        
    if (client) {
        await client.close();
    }
    return result;
}

module.exports.stationInstall = async (planetName) => {

    // procura inicialmente se a estação de carregamento já foi instalada
    const station = await this.stationFind(planetName);
    if(station != null) {
        // estação já foi instalada;
        return -1;
    }
    
    const {client, stationCollection} = await getStationCollectionDB();
    await stationCollection.insertOne({ name: planetName });

    if (client) {
        await client.close();
    }

    // estação foi instalada com sucesso
    return 1;
}
