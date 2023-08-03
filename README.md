# Leaderboard 

<p align="left">API RESTful desenvolvida com Express, Sequelize, Typescript, jwt e bcryptjs no módulo de Backend da Trybe.</p>


## Sobre a Aplicação

###

<p>
Utilizando uma arquitetura em camadas (Model, Service e Controller) a aplicação pode listar, 
cadastrar e finalizar partidas de futebol entre times presentes no banco de dados, 
e é responsável por processar as partidas e entregar a tabela classificatória dos times para que a aplicação
do front consuma e renderize essas informações.

</p>


<details>
<summary>🐳 Rodando a aplicação com Docker </summary><br />


Clone o projeto, entre na raiz da aplicação e execute o comando 

```
npm run compose:up
```

e a aplicação estará ouvindo na porta local 3001 no container `app_backend`, há também uma aplicação react rodando como `app_frontend` exposto na porta local 3000 (importante ressaltar que não é de minha autoria a aplicação do front, e sim da trybe) e o banco de dados MySQL estará exposto na porta 3306.

O seu docker-compose precisa estar na versão 1.29 ou superior.

</details>

## Rota Login

<details>
<summary><strong> POST /login</strong></summary><br />
Endpoint responsável por realizar o login na aplicação, a response é um token processado pelo jwt e será validado em outros endpoints que requerem a autorização
<br />

+ cURL
    ```bash
    curl --request POST \
      --url http://localhost:3001/login \
      --header 'Content-Type: application/json' \
      --data '{
      "email" : "admin@admin.com",
      "password" : "secret_admin"
      }'
    ```
+ RESPONSE:
    ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE2OTEwOTQzMTV9.VE_0aqRcFc5Ft1VyULlO47bGPIp6qYTmwiNwei_T7Ko"
  }
    ```
+ ERRORS:

  + status `400` caso algum campo `email` ou `password` não esteja presente no corpo da requisição retorna a response no formato
    ```json
    { "message": "All fields must be filled" }
    ```
  + status `401` caso o email, ou a senha estejam fora dos padrões válidos ou não escritos no banco de dados, retorna a response no seguinte formato
    ```json
    { "message": "Invalid email or password" }
    ```
</details>

<details>
<summary><strong> GET /login/role</strong></summary><br />
Endpoint responsável por retornar o role do usuário a partir do token no header da requisição.

<br />

+ cURL

    ```bash
    curl --request GET \
      --url http://localhost:3001/login/role \
      --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE2OTEwOTQzMTV9.VE_0aqRcFc5Ft1VyULlO47bGPIp6qYTmwiNwei_T7Ko'
    ```

+ RESPONSE

    ```json
    { "role": "admin" }
    ```
+ ERRORS
  + status `401` caso o header não possua o campo `authorization`
    ```json
    { "message": "Token not found" }
    ```
  + status `401` caso o token não seja válido
    ```json
    { "message": "Token must be a valid token" }
    ```

</details>

## Rota Teams
<details>
<summary><strong> GET /teams</strong></summary><br />
Endpoint responsável por retornar a lista de times cadastrados no banco de dados
<br />

+ cURL

    ```bash
    curl --request GET \
      --url http://localhost:3001/teams
    ```

+ RESPONSE

    ```json
    [
      {
        "id": 1,
        "teamName": "Avaí/Kindermann"
      },
      {
        "id": 2,
        "teamName": "Bahia"
      },
      {
        "id": 3,
        "teamName": "Botafogo"
      },
      ...
    ]
    ```

</details>

<details>
<summary><strong> GET /teams/:id</strong></summary><br />
Esse endpoint é responsável por buscar um time por id no banco de dados

<br />

+ cURL

    ```bash
    curl --request GET \
      --url http://localhost:3001/teams/1
    ```

+ RESPONSE

    ```json
    {
      "id": 1,
      "teamName": "Avaí/Kindermann"
    }
    ```
+ ERRORS
  + status `404` caso o id passado não esteja registrado no banco de dados retorna a response no seguinte formato
  ```json
  { "message": "Team not found" }
  ```
</details>



## Rota Matches

<details>
<summary><strong> GET /matches</strong></summary><br />
Endpoint responsável por retornar a lista de todas as partidas cadastradas no banco de dados, há um filtro opcional para retornar as partidas em progresso, ou finalizadas
<br />

+ cURL
  + para listar todas as partidas
    ```bash
    curl --request GET \
      --url http://localhost:3001/matches
    ```
  + para listar apenas partidas finalizadas
    ```bash
    curl --request GET \
    --url 'http://localhost:3001/matches?inProgress=false'
    ```
  + para listar apenas partidas em andamento
    ```bash
    curl --request GET \
    --url 'http://localhost:3001/matches?inProgress=true'
    ```
+ RESPONSE

    ```json
    [
      {
        "id": 1,
        "homeTeamId": 16,
        "homeTeamGoals": 1,
        "awayTeamId": 8,
        "awayTeamGoals": 1,
        "inProgress": false,
        "homeTeam": {
          "teamName": "São Paulo"
        },
        "awayTeam": {
          "teamName": "Grêmio"
        }
      },
      ...
      {
        "id": 41,
        "homeTeamId": 16,
        "homeTeamGoals": 2,
        "awayTeamId": 9,
        "awayTeamGoals": 0,
        "inProgress": true,
        "homeTeam": {
          "teamName": "São Paulo"
        },
        "awayTeam": {
          "teamName": "Internacional"
        }
      }
    ]
    ```

</details>

<details>
<summary><strong> PATCH /matches/:id/finish</strong></summary><br />
Endpoint responsável por finalizar uma partida por id no banco de dados
<br />

+ cURL

    ```bash
    curl --request PATCH \
      --url http://localhost:3001/matches/41/finish \
      --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE2OTEwOTQzMTV9.VE_0aqRcFc5Ft1VyULlO47bGPIp6qYTmwiNwei_T7Ko'
    ```

+ RESPONSE
  
  + caso o progresso da partida tenha sido alterado com sucesso, o retorno da requisição é apena `1` com status `200`
    ```json
    1
    ```
+ ERRORS
  + status `401` caso a requisição não tenha em seu header um token `authorization`
    ```json
    { "message": "Token not found" }
    ```
  + status `401` caso o token não seja válido
    ```json
    { "message": "Token must be a valid token" }
    ```

</details>

<details>
<summary><strong> PATCH /matches/:id</strong></summary><br />
Endpoint responsável por atualizar o registro de gols de uma partida por id no banco de dados
<br />

+ cURL

    ```bash
    curl --request PATCH \
      --url http://localhost:3001/matches/41 \
      --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE2OTEwOTQzMTV9.VE_0aqRcFc5Ft1VyULlO47bGPIp6qYTmwiNwei_T7Ko' \
      --header 'Content-Type: application/json' \
      --data '{
      "homeTeamGoals": 3,
      "awayTeamGoals": 6
    }'
    ```

+ RESPONSE
  
  + caso o progresso da partida tenha sido alterado com sucesso, retorna a seguinte response com status `200`
    ```json
    { "message": "OK"}
    ```
+ ERRORS
  + status `401` caso a requisição não tenha em seu header um token `authorization`
    ```json
    { "message": "Token not found" }
    ```
  + status `401` caso o token não seja válido
    ```json
    { "message": "Token must be a valid token" }
    ```

</details>

<details>
<summary><strong> POST /matches</strong></summary><br />
Endpoint responsável por realizar  o registro de uma partida no banco de dados
<br />

+ cURL

    ```bash
    curl --request POST \
      --url http://localhost:3001/matches \
      --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE2OTEwOTQzMTV9.VE_0aqRcFc5Ft1VyULlO47bGPIp6qYTmwiNwei_T7Ko' \
      --header 'Content-Type: application/json' \
      --data '{
      "homeTeamId": 16,
      "awayTeamId": 8,
      "homeTeamGoals": 2,
      "awayTeamGoals": 2
    }'
    ```

+ RESPONSE
    ```json
    {
      "id": 49,
      "homeTeamId": 16,
      "awayTeamId": 8,
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
      "inProgress": true
    }
    ```
+ ERRORS
  + status `401` caso a requisição não tenha em seu header um token `authorization`
    ```json
    { "message": "Token not found" }
    ```
  + status `401` caso o token não seja válido
    ```json
    { "message": "Token must be a valid token" }
    ```
  + status `404` caso o id de alguma das equipes não esteja registrado no banco de dados
    ```json
    { "message": "There is no team with such id!"  }
    ```
  + status `422` caso o id de `homeTeamId` e `awayTeamId` sejam iguais
    ```json
    { "message": "It is not possible to create a match with two equal teams" }
    ```
  

</details>

## Rota Leaderboard
<details>
<summary><strong> GET /leaderboard</strong></summary><br />
Endpoint responsável por retornar a tabela classificatória dos time computando
partidas jogadas em casa e como visitante
<br />

+ cURL

    ```bash
    curl --request GET \
      --url http://localhost:3001/leaderboard
    ```

+ RESPONSE

    ```json
    [
      {
        "name": "Palmeiras",
        "totalPoints": 13,
        "totalGames": 5,
        "totalVictories": 4,
        "totalDraws": 1,
        "totalLosses": 0,
        "goalsFavor": 17,
        "goalsOwn": 5,
        "goalsBalance": 12,
        "efficiency": 86.67
      },
      {
        "name": "Santos",
        "totalPoints": 11,
        "totalGames": 5,
        "totalVictories": 3,
        "totalDraws": 2,
        "totalLosses": 0,
        "goalsFavor": 12,
        "goalsOwn": 6,
        "goalsBalance": 6,
        "efficiency": 73.33
      },
      ...
    ]
    ```

</details>

<details>
<summary><strong> GET /leaderboard/home</strong></summary><br />
Endpoint responsável por retornar a tabela classificatória dos time computando 
apenas partidas jogadas em casa

<br />

+ cURL

    ```bash
    curl --request GET \
      --url http://localhost:3001/leaderboard/home
    ```

+ RESPONSE

    ```json
    [
      {
        "name": "Santos",
        "totalPoints": 13,
        "totalGames": 5,
        "totalVictories": 4,
        "totalDraws": 1,
        "totalLosses": 0,
        "goalsFavor": 17,
        "goalsOwn": 5,
        "goalsBalance": 12,
        "efficiency": 86.67
      },
      {
        "name": "Palmeiras",
        "totalPoints": 11,
        "totalGames": 5,
        "totalVictories": 3,
        "totalDraws": 2,
        "totalLosses": 0,
        "goalsFavor": 12,
        "goalsOwn": 6,
        "goalsBalance": 6,
        "efficiency": 73.33
      },
      ...
    ]
    ```
</details>

<details>
<summary><strong> GET /leaderboard/away</strong></summary><br />
Endpoint responsável por retornar a tabela classificatória dos time computando 
apenas partidas jogadas como visitante

<br />

+ cURL

    ```bash
    curl --request GET \
      --url http://localhost:3001/leaderboard/away
    ```

+ RESPONSE

    ```json
    [
      {
        "name": "Internacional",
        "totalPoints": 9,
        "totalGames": 3,
        "totalVictories": 3,
        "totalDraws": 0,
        "totalLosses": 0,
        "goalsFavor": 9,
        "goalsOwn": 3,
        "goalsBalance": 6,
        "efficiency": 100
      },
      {
        "name": "Palmeiras",
        "totalPoints": 6,
        "totalGames": 2,
        "totalVictories": 2,
        "totalDraws": 0,
        "totalLosses": 0,
        "goalsFavor": 7,
        "goalsOwn": 0,
        "goalsBalance": 7,
        "efficiency": 100
      },
      ...
    ]
    ```
</details>

<h2 align="left">Desenvolvido com</h2>

###

<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" height="40" alt="typescript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="40" alt="javascript logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" height="40" alt="express logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="40" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" height="40" alt="mysql logo"  />
</div>

###

###


###### Importante! Os arquivos de minha autoria estão no diretório `app/backend`
