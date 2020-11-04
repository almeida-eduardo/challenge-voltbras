// configurações gerais
const config = {
    api: {
      uri: 'https://api.arcsecond.io/',
      number_pages: 1,
      min_planet_mass: 25,
      mass_unit: 'M_jup',
    },
    db: {
      uri: 'mongodb://127.0.0.1:27017',
      database_name: 'challenge',
      collection_name: 'station'
    }
   };

   module.exports = config;