<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Configuration
Create a custom `.env` file based on `.env.example` and update its values.

```bash
cp .env.example .env
```

## Running the app

Running in docker

```bash
# development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file ./.env up --build

# production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file ./.env up --build
```

Running locally

```bash
# Install dependencies
yarn install

# development with watch mode
yarn run start:dev

# production mode
yarn run start:prod
```
