const { RESTDataSource } = require('apollo-datasource-rest');

const config = require('../config');
/**
 * config
 *   - uri: define a uri da api do serviço Arcsecond
 *   - number_pages: define a quantidade de páginas que irá recuperar do serviço do Arcsecond
 *   - min_planet_mass: valor mínimo da massa do planeta
 */
// não sei se curti essa desestruturação, muito massa você ter feito até uma desestruturação dupla aqui mas acho que
// em alguns pontos do código lá em baixo não ficou muito claro de onde vinham essas coisas,
// ficaria um pouco mais claro se ficasse explícito que ta pegando da config, tipo config.api.min_planet_mass
 const { api: { uri, number_pages, min_planet_mass, mass_unit } } = config;

class PlanetAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = uri;
    }

    // esses jsdoc poderiam ser typescript
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
                    planet.mass.value && planet.mass.value > min_planet_mass /** comentário da linha 12 */ && 
                    planet.mass.unit  && planet.mass.unit == mass_unit);

        console.log(`page ${page} results.length ${results.length}`);
        // não entendi esse if, se for um array vazio ele poderia entrar no map também sem problemas, não?
        // continuaria retornando um array vazio
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
        // ba isso aqui ficou bem legal, parabéns!
        let pages = [];
        Array.from({ length: number_pages }, (_, i) => {
            pages.push(this.getAllPlanetsPage(i+1));
        })
        
        // realiza a chamada assíncrona para cada uma das páginas e monta a lista de resultados
        const response = await Promise.all(pages).then((pages)=>{
            // isso aqui também ficou daora, meio dificil de entender lendo mas é culpa do javascript kkkk
            // usou bem as peculiaridades da linguagem
            return [].concat.apply([], pages);
        });
        
        return response;
        
        // acho que você esqueceu esse comment aqui
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
    // legal você ter separado em uma função só pra isso, talvez era uma boa aquele filter também estar separado, mas
    // não sei se reducer fica muito claro já que é usado dentro de um .map() e não um .reduce() 
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