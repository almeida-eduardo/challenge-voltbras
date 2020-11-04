module.exports = {
    Query: {
        suitablePlanets: (_, __, { dataSources}) => dataSources.planetAPI.getAllPlanets()
    },
    Mutation: {
        installStation: async (_, { planetName }, { dataSources }) => {
            if(!planetName){
                return {
                  success: false,
                  message: 'nome do planeta não foi definido',
                };
            }
            const result = await dataSources.stationAPI.installStation(planetName);
            const failStatus = result == 0 ? "não pôde ser" : "já está";
       
            return {
              success: result == 1,
              message: result == 1 ? 'estação instalada com sucesso' : `a estação ${failStatus} instalada no planeta '${planetName}'`,
            };
          },        
    },
    Planet: {
        hasStation: async (planet, _, { dataSources }) => {
            // Se não há planeta definido ou se o planeta não tem nome definido
            if(!planet || !planet.name) return false;

            return dataSources.stationAPI.isStationInstalled(planet.name);
        },
    },
}