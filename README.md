<p align="center">
  <a href="https://github.com/Scrip7/fmovies-crawler" target="blank"><img src="https://raw.githubusercontent.com/Scrip7/fmovies-crawler/main/images/logo.png" width="320" alt="FMovies Crawler Logo" /></a>
</p>

<p align="center">
  <a href="https://github.com/Scrip7/fmovies-crawler" target="_blank">fmovies-crawler</a> is built on top of the <a href="https://github.com/nestjs/nest" target="_blank">Nest</a> framework<br/>Uses <a href="https://www.npmjs.com/package/selenium-webdriver" target="_blank">selenium-webdriver</a> and <a href="https://www.npmjs.com/package/node-html-parser" target="_blank">node-html-parser</a> under the hood<br/>Allows you to fetch Movies and TV series from the FMovies website
</p>

<p align="center">
  <a href="https://github.com/Scrip7/fmovies-crawler/actions/workflows/test-e2e.yml" target="_blank"><img alt="E2E tests" src="https://img.shields.io/github/workflow/status/Scrip7/fmovies-crawler/e2e%20testing?label=e2e%20testing"></a>
  <a href="https://github.com/Scrip7/fmovies-crawler/blob/main/LICENSE" target="_blank"><img alt="License" src="https://img.shields.io/github/license/scrip7/fmovies-crawler?color=blue"></a>
  <a href="https://github.com/Scrip7/fmovies-crawler/pulls" target="_blank"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" /></a>
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
-   [Documentation](#documentation)
-   [Useful resources](#useful-resources)

## Features

-   In-memory response caching
-   Supports multiple, optimized selenium instances

## Coverage

-   Simple video search _(only with the title)_
-   Advanced video search
    -   Filter by Genres, Video Types, Countries, and Qualities
    -   Pagination
-   Home page
    -   Slider
    -   Recommended Movies, Series, and Trending
    -   Latest Movies
    -   Latest Series
    -   Requested Videos
-   Simple video details
-   Full video details
    -   Download link _(If available!)_
    -   Streaming link _(with `.m3u8` extension)_
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

> First, make sure that you have [Chrome](https://www.google.com/chrome/), and [Redis](https://redis.io/) installed, and running on your machine.

```bash
# Development mode (watch mode)
yarn start:dev

# Production mode
yarn start:prod
```

## Documentation

After running the application, head to the http://localhost:3000/docs for the API description.

<p align="center">
  <img src="https://raw.githubusercontent.com/Scrip7/fmovies-crawler/main/images/docs.png" alt="Documentation page">
</p>

## Useful resources

-   [FMovies.name](https://fmovies.name/) - The official FMovies website that lists their active domains.
-   [Download VNC Viewer](https://www.realvnc.com/en/connect/download/viewer/) - To integrate VNC viewer with Docker container.
-   [Docker compose documentation](https://docs.docker.com/compose/)