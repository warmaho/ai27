## Description

Pokemon API with [Nest](https://github.com/nestjs/nest) framework TypeScript.


• Create a Node.js REST API that accepts the Pokémon name as a parameter in the URL.

• The above method should make a GET request to the PokeAPI to retrieve the data of the specified Pokémon and store it in a database.

• The following data should be retrieved and stored in the database:

    Id
    Name
    The first four moves from the moves list (if there are more than four)
    Types

• Create a Node.js REST API that accepts the Pokémon id as a parameter and deletes it from the database.

• Create a Node.js REST API that accepts the Pokémon name as a parameter and deletes it from the database.

• Create a REST API that allows listing the Pokémon stored in the database.

## Getting Started

1. Clone the repository
2. Run
```
yarn install
```
3. Database set-up
```
docker-compose up -d
```
4. Clone __.env.template__ file and rename to __.env__
5. Fill in the variables with the respective values
6. Run in dev
```
yarn run start:dev
```
7. Populate the database
```
http://localhost:3000/api/seed
```
## Stack
* Nest
* MongoDB
* Docker

# Production build
1. Make file ```.env.prod```
2. Fill in the variables for production
3. Build the image
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
# POSTMAN
Inside the root directory, you will find the file "Api POKE.postman_collection.json" for Postman.