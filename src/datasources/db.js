const { MongoClient } = require("mongodb");
const config = require('../config');

/**
 * config
 *   - uri: endereço do servidor MongoDB
 *   - database_name: nome do banco de dados dentro do MongoDB
 *   - collection_name: nome da tabela que conterá as informações estações instaladas
 */
const { db: { uri, database_name, collection_name } } = config;

// não curti tanto a forma como você lida com o mongo aqui,
// esta meio hard-coded a collection que ele vai pegar, pra esse desafio serviu muito bem mas
// a adição de novas features seria complicada nesse formato

// e também, não é necessário fazer o connect a cada vez que vai buscar algo,
// poderia ter uma sessão que sobe junto com o servidor, evitando ter que ficar connectando/desconectando aumentando a margem de erro
// tem um pacote bem massa pra trabalhar com o mongodb que é o mongoose, recomendo dar uma olhada

get_db_collection = async () => {
    // Use connect method to connect to the Server
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    const database = client.db(database_name);
    const collection = database.collection(collection_name);
    // o fato de você retornar esse objeto faz com que todo o intellisense derivado dos type declarations do
    // mongodb sejam perdidos, ali na linha 29 fica tudo any, não tem auto complete, etc
    // e também não sei se ficou muito claro o que "collection" quer dizer, talvez stations ou stationCollection ficaria mais claro?
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

        // retornar -1 não deixa nada claro se deu certo ou não...
        // talvez um false aqui e true caso sucesso? Ou até mesmo um throw?
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
