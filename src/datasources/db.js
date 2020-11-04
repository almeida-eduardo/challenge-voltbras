const { MongoClient } = require("mongodb");
const config = require('../config');

/**
 * config
 *   - uri: endereço do servidor MongoDB
 *   - database_name: nome do banco de dados dentro do MongoDB
 *   - collection_name: nome da tabela que conterá as informações estações instaladas
 */
const { db: { uri, database_name, collection_name } } = config;

get_db_collection = async () => {
    // Use connect method to connect to the Server
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    const database = client.db(database_name);
    const collection = database.collection(collection_name);
    return {client, collection};
}

module.exports.stationFind = async (planetName) => {
    
    const {client, collection} = await get_db_collection();

    const result = await collection.findOne({ name: planetName });
        
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
    
    const {client, collection} = await get_db_collection();
    await collection.insertOne({ name: planetName });

    if (client) {
        await client.close();
    }

    // estação foi instalada com sucesso
    return 1;
}
