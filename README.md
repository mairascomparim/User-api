# API HTTP com Express.js e TypeScript

## Descrição
Esta API foi desenvolvida utilizando **Express.js** com **TypeScript**, e tem como objetivo fornecer um CRUD (Create, Read, Update, Delete) de usuários e seus endereços. A relação entre usuários e endereços no banco de dados MySQL é de **1:N** (um usuário pode ter múltiplos endereços).

O projeto inclui funcionalidades de segurança implementadas com **JWT (JSON Web Token)**, garantindo que todas as rotas sejam protegidas e acessíveis apenas para usuários autenticados.

## Funcionalidades
- CRUD completo de usuários
- CRUD completo de endereços
- Relacionamento de 1:N entre usuários e endereços
- Autenticação e autorização com JWT
- Documentação de API utilizando Swagger
- Testes unitários para garantir a estabilidade do código

## Tecnologias Utilizadas
- **Node.js** com **Express.js**
- **TypeScript**
- **MySQL** com **mysql2/promise**
- **JWT** para autenticação
- **Swagger** para documentação
- **Jest** para testes unitários

## Endpoints
A API possui os seguintes endpoints principais:
- `/users` - Endpoints para criar, listar, atualizar e deletar usuários
- `/addresses` - Endpoints para criar, listar, atualizar e deletar endereços

## Documentação com Swagger
A documentação da API está disponível através do arquivo Swagger.json, você pode colocar as informações no link: https://editor.swagger.io/ para melhor visualização


## Segurança
Todas as rotas da API são protegidas por JWT, garantindo que apenas usuários autenticados possam acessá-las. Para utilizar a API, você deverá se autenticar e incluir o token JWT no header das requisições.

## Testes
Testes unitários foram implementados utilizando **Jest** para garantir a qualidade do código e a funcionalidade correta da API. Para rodar os testes, utilize o comando:
npm test
