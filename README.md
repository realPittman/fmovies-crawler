<p align="center">
  <a href="https://github.com/Scrip7/fmovies-crawler" target="blank"><img src="https://raw.githubusercontent.com/Scrip7/fmovies-crawler/main/images/logo.png" width="320" alt="FMovies Crawler Logo" /></a>
</p>
<p align="center">
  <a href="https://github.com/Scrip7/fmovies-crawler" target="_blank">fmovies-crawler</a> is built on top of the <a href="https://github.com/nestjs/nest" target="_blank">Nest</a> framework<br/>And it uses <a href="https://www.npmjs.com/package/selenium-webdriver" target="_blank">selenium-webdriver</a> under the hood.<br/>It allows you to fetch Movies and TV series information from the FMovies website.
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/github/license/scrip7/fmovies-crawler?color=blue">
</p>

## Configuration

Create your own `.env` file based on `.env.example` file and update its values.

```bash
cp .env.example .env
```

## Running the app

Running with [Docker compose](https://docs.docker.com/compose/) (recommended)

```bash
# development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file ./.env up --build

# production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file ./.env up -d --build
```

Running on your local machine

```bash
# Install dependencies
yarn install

# Development mode (watch mode)
yarn start:dev

# Production mode
yarn start:prod
```

## Useful resources

-   [FMovies.name](https://fmovies.name/) - The official FMovies website that lists their active domains.
-   [Download VNC Viewer](https://www.realvnc.com/en/connect/download/viewer/) - To integrate VNC viewer with Docker container.