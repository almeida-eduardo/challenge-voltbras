# Review Notes

Salve Eduardo, tudo bem?!

Sou o Vinícius e vai ser um prazer fazer o code review do seu projeto de desafio da @voltbras!

Ficamos muito felizes e agradecemos muito pela sua disponibilidade e comprometimento ao realizar nosso desafio, valeuzão! :hugs:

Vou fazer um review parecido com o que fazemos normalmente no dia-a-dia aqui da empresa, porém com as observações em forma de **comentários no código.**

Qualquer dúvida pode adicionar um comentário aqui nesse pull request mesmo, ou pode falar com o Carlos ou o Henke que eles tem meu contato!

---

### Considerações gerais

Primeiramente parabéns! Seu projeto está muito bom, deu pra perceber que você fez com bastante dedicação, muito massa!

O projeto está muito bem estruturado, com testes unitários (passando) e tudo rodou sem problemas, muito show!

Seria muito interessante ter utilizado typescript, vi até que você chegou a utilizar jsdoc(aqueles comentários com @param @return e tal) em alguns arquivos, mas com uma ferramenta como typescript disponível não curti muito, porém isso é um extra, então não tem problema haha

Achei um pouco estranha a padronização de código também, alguns pontos você utilizou camelCase, outros snake_case, o ideal seria utilizar camelCase em tudo em projetos javascript, mas também isso é detalhe.

Não comentei muito nos arquivos de testes porque estão muito bons, parabéns de verdade! Muito legal que você escreveu bastante testes e todos estão passando, isso é realmente muito valioso.

Dois pontos que achei um pouco curioso sobre o projeto, e que são um pouco fora de padrão foram os seguintes:

- O binding da porta 8080:4000 no docker compose.
  - Achei um pouco estranho isso por que, normalmente o padrão de servidores com apollo é a porta 400X mesmo, e o fato de ter escolhido a porta 8080 não faz muita diferença, já que o navegador precisa da espcificação da porta (até faria sentido se fosse pra porta 80, dai dava pra acessar pelo http://localhost/ sem o :8080). Teve algum motivo específico pra isso?
- `package.json` na pasta `src`
  - Geralmente, o mais comum estar na raiz do projeto, até me perdi um pouco na hora de rodar os testes kkkk.
