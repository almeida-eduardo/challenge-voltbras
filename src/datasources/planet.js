const { RESTDataSource } = require('apollo-datasource-rest');

const config = require('../config');
/**
 * config
 *   - uri: define a uri da api do serviço Arcsecond
 *   - number_pages: define a quantidade de páginas que irá recuperar do serviço do Arcsecond
 *   - min_planet_mass: valor mínimo da massa do planeta
 */
const { api: { uri, number_pages, min_planet_mass, mass_unit } } = config;

class PlanetAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = uri;
    }

    /**
     * getAllPlanetsPage
     *   - recupera todos os planetas em uma página específica do serviço Arcsecond
     *   - filtra os planetas que possuem massa maior que o valor definido em config.api.min_planet_mass em unidades de M_jup.
     * 
     * @param {int} page número da página a ser buscada
     * 
     * @return Array(Planets)
     */
    async getAllPlanetsPage(page) {
        const response = await this.get('exoplanets', { 'page': page });

        // retorna vazio se não há resultados
        if(!Array.isArray(response.results)) {
            console.log(`page ${page} no results`);
            return [];
        }
        
        // filtra os planetas com gravidade alta
        const results = response.results.filter(planet => 
                    planet.mass && 
                    planet.mass.value && planet.mass.value > min_planet_mass && 
                    planet.mass.unit  && planet.mass.unit == mass_unit);

        console.log(`page ${page} results.length ${results.length}`);
        return results.length > 0 ? results.map(planet => this.planetReducer(planet)) : [];
    }

    /**
     * getAllPlanets
     *   - recupera todos os planetas dentre o número de páginas (definido em config.api.number_pages) da api do Arcsecond
     *   - realiza as chamadas para o carregameno das páginas em paralelo.
     * 
     *  @return Array[Planets]
     */
    async getAllPlanets() {

        // cria a lista de chamadas para o serviço do Arcsecond para cada página, filtrando pelos planetas com gravidade alta
        let pages = [];
        Array.from({ length: number_pages }, (_, i) => {
            pages.push(this.getAllPlanetsPage(i+1));
        })
        
        // realiza a chamada assíncrona para cada uma das páginas e monta a lista de resultados
        const response = await Promise.all(pages).then((pages)=>{
            return [].concat.apply([], pages);
        });
        
        return response;

        // const response = await this.get('exoplanets', { 'page': 2 });
        // return Array.isArray(response.results) ? response.results
        //     .filter(planet => 
        //         planet.mass && 
        //         planet.mass.value && planet.mass.value > min_planet_mass && 
        //         planet.mass.unit  && planet.mass.unit == mass_unit)
        //     .map(planet => this.planetReducer(planet)) : [];
    }

    /**
     * planetReducer
     *   - reducer do resultado retornado da api do Arcsecond para os atributos do schema Planet
     * 
     * @param Arcsecond.Planet
     * 
     * @return Planet
     */
    planetReducer(planet) {
        return {
            name: planet.name,
            mass: planet.mass.value,
            unit: planet.mass.unit,
            hasStation: false
        }
    }

}

module.exports = PlanetAPI;