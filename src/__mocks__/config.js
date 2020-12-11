/**
 * configurações gerais
 * @typedef {Object} api:
 * @property {string} uri: define a uri da api do serviço Arcsecond
 * @property {number} numberPages: define a quantidade de páginas que irá recuperar do serviço do Arcsecond
 * @property {number} minPlanetMass: valor mínimo da massa do planeta
 * @property {string} massUnit: define a unidade de medida da massa do planeta
 * @typedef {Object} db:
 * @property {string} uri: endereço do servidor MongoDB
 * @property {string} databaseName: nome do banco de dados dentro do MongoDB
 * @property {string} stationCollectionName: nome da tabela que conterá as informações das estações instaladas
 */
const config = {
    api: {
      uri: 'https://api.arcsecond.io/',
      numberPages: 1,
      minPlanetMass: 25,
      massUnit: 'M_jup',
    },
    db: {
      uri: 'mongodb://127.0.0.1:27017',
      databaseName: 'challenge',
      stationCollectionName: 'station'
    }
   };

   module.exports = config;