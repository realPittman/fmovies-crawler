<p align="center">
  <a href="https://github.com/Scrip7/fmovies-crawler" target="blank"><img src="https://raw.githubusercontent.com/Scrip7/fmovies-crawler/main/images/logo.png" width="320" alt="FMovies Crawler Logo" /></a>
</p>

<p align="center">
  <a href="https://github.com/Scrip7/fmovies-crawler" target="_blank">fmovies-crawler</a> is built on top of the <a href="https://github.com/nestjs/nest" target="_blank">Nest</a> framework<br/>Uses <a href="https://www.npmjs.com/package/selenium-webdriver" target="_blank">selenium-webdriver</a> and <a href="https://www.npmjs.com/package/node-html-parser" target="_blank">node-html-parser</a> under the hood<br/>Allows you to fetch Movies and TV series from the FMovies website
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/github/license/scrip7/fmovies-crawler?color=blue">
</p>

## Table of contents

-   [Features](#features)
-   [Coverage](#coverage)
-   [Configuration](#configuration)
-   [Docker](#docker)
    -   [Building Docker containers](#building-docker-containers)
    -   [Running Docker containers](#running-docker-containers)
    -   [Debugging with VNC Viewer](#debugging-with-vnc-viewer)
-   [Installing locally](#installing-locally)
-   [Running locally](#running-locally)
-   [Useful resources](#useful-resources)

## Features

-   In-memory response caching
-   Supports multiple, and optimized selenium instances

## Coverage

-   Simple video search (by name)
-   Advanced video search _(work in progress)_
-   Home page
    -   Slider
    -   Recommended Movies, Series, and Trending
    -   Latest Movies
    -   Latest Series
    -   Requested Videos
-   Video simple details _(work in progress)_
    -   Includes short information about the video
-   Video details
    -   Includes full information about the video
    -   Download link _If available!_
    -   Streaming link (with `.m3u8` extension)
    -   Series and episodes

## Configuration

Create your own `.env` file based on `.env.example` file and update its values.

```bash
cp .env.example .env
```

## Docker

Docker is a tool designed to make it easier to create, deploy, and run applications by using containers.

Containers allow a developer to package up an application with all of the parts it needs, such as libraries and other dependencies, and deploy it as one package.

We recommend you to run this application as Docker containers, instead of running it on your local machine.

If you're not familiar with Docker, [this guide](https://docs.docker.com/get-started/) is a great point to start.

### Building Docker containers

```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build
```

### Running Docker containers

```bash
# development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file ./.env up

# production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file ./.env up -d
```

### Debugging with VNC Viewer

By using VNC Viewer, you can connect to the Selenium container to see what's going on behind the scene.

If you don't have VNC Viewer installed on your machine, try to [download and install VNC Viewer](https://www.realvnc.com/en/connect/download/viewer/).

-   edit `.env` file and set `SELENIUM_HEADLESS` to `false`, then restart the app container if it's already running
-   open VNC Viewer and enter `127.0.0.1:7900` in the address bar
-   use password `secret` and leave the username to be empty
-   enjoy!

## Installing locally

```bash
yarn install
```

## Running locally

```bash
# Development mode (watch mode)
yarn start:dev

# Production mode
yarn start:prod
```

## Useful resources

-   [FMovies.name](https://fmovies.name/) - The official FMovies website that lists their active domains.
-   [Download VNC Viewer](https://www.realvnc.com/en/connect/download/viewer/) - To integrate VNC viewer with Docker container.
-   [Docker compose documentation](https://docs.docker.com/compose/)