
module.exports.stationFind = async (planetName) => {
    result = { name: planetName };
        
    return result;
}

module.exports.stationInstall = async (planetName) => {
    // procura inicialmente se a estação de carregamento já foi instalada
    const station = await this.stationFind(planetName);
    if(station != null) {
        // estação já foi instalada;
        return -1;
    }
    
    // estação foi instalada com sucesso
    return 1;
}
