# Backend Challenge Voltbras

O projeto a seguir faz parte do [desafio projeto de backend](https://gitlab.com/voltbras/backend-challenge) da [Voltbras] que propõe o seguinte objetivo:

> descobrir em quais planetas a Voltbras pode instalar seus novos postos de carregamento para otimizar o serviço de recarga.

# Descrição do projeto

O projeto é constituído de dois serviços: suitablePlanets e installStation.

#### Serviço suitablePlanets

Este serviço realiza a consulta aos planetas que oferecem uma gravidade alta (requisito especificado no desafio), através das seguintes etapas:
- monta uma lista de páginas que serão carregadas da api do [Arcsecond]
- realiza a busca dos planetas de cada página na api do [Arcsecond]
- filtra os planetas que possuem a massa maior que 25 M_jup
- concatena todos os resultados das páginas isoladas em um resultado só

#### Serviço installStation

Este serviço realiza a instalação de uma estação de carregamento, através das seguintes etapas:
- recebe a identificação de um planeta para a instalar uma estação de carregamento
- identifica se o planeta possui ou não uma estação de carregamento
- registra que o planeta teve uma estação de carregamento instalada.

### Tecnologias utilizadas

O projeto, como um todo, utiliza as seguintes tecnologias/bibliotecas:

* [node.js] (versão 12 ou superior) - servidor de backend que realiza os processamentos das requisições solicitadas
* [Apollo GraphQL Server] (versão 2.18 ou superior) - servidor [GraphQL] que roda sobre o node.js para realizar as requisições às diversas fontes de dados
* [MongoDB] (versão 4.2.8 ou superior) - Banco de dados NoSQL que armazena quais planetas possui estações de carregamento instaladas
* [Docker] (versão 19.03 ou superior) - serviço de container para armazenamento e execução do servidores [node.js] e [MongoDB]
* [Docker Compose] (versão 1.26 ou superior) - serviço de orquestração de comamndos para instaciamento de containers Docker
* [Nosqlclient] (versão 4.0 ou superior) - client web para consulta ao banco de dados [MongoDB]

As seguintes bibliotecas [node.js] são necessárias para a execução do projeto backend:
* apollo-datasource (versão 0.7.2 ou superior): biblioteca para comunicação com fontes de dados
* apollo-datasource-rest (versão 0.9.4 ou superior): biblioteca para comunicação com fontes de dados REST
* apollo-server (versão 2.18.2 ou superior): o servidor [GraphQL] em [node.js]
* graphql (versão 15.4.0 ou superior): biblioteca requerida pela biblioteca apollo-server
* mongodb (versão 3.6.2 ou superior): biblioteca cliente para conexão e manuseio do banco de dados [MongoDB]
* nodemon (versão 2.0.6 ou superior): biblioteca que realiza o recarregamento do servidor [node.js] ao identificar mudanças nos códigoss fontes
* jest (versão 26.6 ou superior): biblioteca para realização dos testes unitários
* apollo-server-testing (versão 2.19 ou superior): biblioteca do servidor apollo para apoio à relização dos testes

### Instalação

O projeto pode ser executado em uma instância que contenha o [Docker] e o [Docker Compose] previamente instalados ou isoladamente em uma instância possua o [node.js] e o [MongoDB] instalados. Para realizar a execução do projeto pode-se fazer o download do repositório ou então clonar o repositório a partir da seguinte linha de comando:
```sh
$ git clone https://github.com/almeida-eduardo/challenge-voltbras
```

### Configuração

A configuração do projeto divide-se em duas etapas:
- configuração do container Docker
- configuração da aplicação backend
 

##### Docker

As configurações para serviços e portas que estarão sendo executados é realizada nos arquivos Dockerfile e docker-compose-yml localizados na raiz do projeto. Estão definidas inicialmente as seguintes configurações:
- portas 8080 e 9229 para o servidor [node.js]
- porta 27017 e string de conexão DATABASE_CONNECTIONSTRING para o servidor [MongoDB] 
- porta 3300 para o cliente do banco de dados [Nosqlclient]

**Dockerfile**
```Dockerfile
FROM node:12
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY src/package*.json ./
USER node
RUN npm install
COPY --chown=node:node src/ .
# the port where the node.js application with run
EXPOSE 8080
CMD [ "node", "index.js" ]
```

**docker-compose-yml**
```yml
version: '3.8'
services:
 web:
   build:
     context: .
   container_name: voltbras_web
   # define ports 8080 and 9229 for the node.js server
   ports:
     - 8080:4000
     - 9229:9229
   # define port 8080 for the node.js server
   environment:
     - SERVER_PORT=8080
     - DATABASE_CONNECTIONSTRING=mongodb://mongo:27017
   volumes:
     - ./:/code
   command: npm start

 mongo:
   image: mongo:4.2.8
   container_name: voltbras_mongodb
   # define port 27017 for te MongoDB server
   ports:
     - 27017:27017
   volumes:
     - mongodb:/data/db
     - mongodb_config:/data/configdb
 mongoclient:
   image: mongoclient/mongoclient:latest
   container_name: voltbras_mongoclient
   depends_on:
     - mongo
   # define port 3300 to run the Nosqlclient
   ports:
     - 3300:3000

volumes:
   mongodb:
   mongodb_config:

```

##### Aplicação backend

As configurações iniciais da aplicação estão definidas no arquivo ./src/config.js e constam de dois blocos:
- **api**: configuração para as chamadas da api do [Arcsecond]
- **db**: configuração do banco de dados para armazenamento dos planetas que tiveram estações instaladas

```js
const config = {
    api: {
      uri: 'https://api.arcsecond.io/',
      number_pages: 10,
      min_planet_mass: 25,
      mass_unit: 'M_jup',
    },
    db: {
      uri: 'mongodb://127.0.0.1:27017',
      database_name: 'challenge',
      collection_name: 'station'
    }
   };
```

### Execução via Docker
Após o projeto ter sido baixado executa-se os seguintes comandos do [Docker Compose] com permissões de administrador:
```sh
# realiza o download dos requisitos necessários para o projeto e constrói a imagem do container
$ sudo docker-compose build
# inicia a instância dos serviços em background
$ sudo docker-compose up -d
```

O projeto irá iniciar três serviços distintos, sendo que cada um em uma URL/porta específica:
- servidor [node.js] (portas 8080 e 9229) - serviço principal que irá receber as requisições e retornar os resultados
- servidor [MongoDB]  (porta 27017) - serviço do banco de dados para armazenamento das informações das estações de carregamento instaladas
- serviço [Nosqlclient]  (porta 3300) - serviço web para acesso e consulta ao banco de dados NoSQL [MongoDB]

Para consultar os serviços que estão rodando dentro do Docker:
```sh
$ sudo docker ps
```

### Execução em uma instância node.js e MongoDB
Caso o projeto seja ser rodado em uma instância [node.js] contendo um servidor [MongoDB], após realizar as configurações do backend, o projeto poderá ser rodado com o seguinte linha de comando a partir da pasta /src:
```sh
# instala os pacotes e dependências do projeto
npm install
# executa o serviço do Apollo GraphQL Server
npm start
```

### Consultas

As consultas ao serviço podem ser realizadas através do Apollo Server Playground (que ficará disponível no endereço do serviço do [node.js], seja localmente ou via Docker) ou através de qualquer outro programa que permita chamadas GraphQL (ex.: [Postman](https://www.postman.com/)).

#### suitablePlanets

A consulta para identificar quais são os planetas que são possívels para instalação de uma estação de carregamento pode ser realizada através da seguinte chamada [GraphQL] para o serviço suitablePlanets, especificando quais são as informações que deverão ser retornadas do serviço:

```graphql
query GetSuitablePlanets {
  suitablePlanets {
    name   
    mass
    hasStation
  }
}
```

#### installStation

A instalação de uma estação de carregamento é realizada através da seguinte chamada [GraphQL] para o serviço installStation, incluindo o nome do planeta que se quer realizar a instalação como parâmetro "planetName":

```graphql
mutation InstallStation {
  installStation(planetName: "2MASS J00413538-5621127 A") {
    success
    message
  }
}
```

### Testes

Para a realização de testes unitários pode-se utilizar a seguinte linha de comando, que irá realizar a execução dos testes especificados através da biblioteca [Jest]:
```sh
npm test
```

### Tarefas pendentes 

Dentre as taferas extras, optou-se por não utilizar nenhum ORM uma vez que o banco de dados [MongoDB] já possui uma biblioteca muito rica em funcionalidades para a operacionalização e manuseio do banco de dados utilizado. 


Licença
----

MIT


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)


   [node.js]: <http://nodejs.org>
   [Voltbras]: <https://voltbras.com.br>
   [MongoDB]: <https://www.mongodb.com>
   [Nosqlclient]: <https://www.nosqlclient.com>
   [Arcsecond]: <https://api.arcsecond.io>
   [Apollo GraphQL Server]: <https://www.apollographql.com>
   [Docker]: <https://www.docker.com>
   [Docker Compose]: <https://docs.docker.com/compose/install/>
   [GraphQL]: <https://graphql.org>
   [Jest]: <https://jestjs.io>
   
