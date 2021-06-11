import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import 'chromedriver';
import * as _ from 'lodash';
import {
  Builder,
  By,
  Capabilities,
  ThenableWebDriver,
  until,
} from 'selenium-webdriver';
import { MCloudResponse } from './types/response.types';

const caps = new Capabilities();

export enum VideoType {
  SERIES = 'series',
  MOVIE = 'movie',
}

enum ServerID {
  MyCloud = 28, // GCloud
  Streamtape = 40,
  Doodstream = 42,
}

@Injectable()
export class SeleniumService {
  private readonly baseUri = 'https://fmovies.to/';

  private createBrowser() {
    return new Builder().withCapabilities(caps).forBrowser('chrome').build();
  }

  private async getMCloudEmbedDetails(videoCode: string) {
    const response: AxiosResponse<MCloudResponse> = await axios.get(
      `https://mcloud.to/info/${videoCode}`,
      {
        headers: {
          // This header is required, otherwise MCloud will return an empty response
          referer: 'https://mcloud.to/',
        },
      },
    );

    const cdn = {
      download: '',
      stream: '',
    };

    for (let i = 0; i < response.data.media.sources.length; i++) {
      if (response.data.media.sources[i].label) {
        cdn.download = response.data.media.sources[i].file;
      } else {
        cdn.stream = response.data.media.sources[i].file;
      }
    }
    return cdn;
  }

  private async findVideoType(browser: ThenableWebDriver): Promise<VideoType> {
    return browser.executeScript(`
      var videoType = undefined;
      $(".breadcrumb").find(".breadcrumb-item").each((key, value) => {
          switch ($(value).find('span').text()){
              case "TV-Series":
                  videoType = "series";
              break;
              case "Movies":
                  videoType = "movie";
              break;
          }
      })
      return videoType;
    `);
  }

  // TODO: add response type
  private async fetchSeasonDetails(browser: ThenableWebDriver) {
    return browser.executeScript(`
      var seasons = {};
      $('#watch #episodes .bl-seasons ul li').each(
        (key, item) => {
          seasons[$(item).attr('data-id')] = {
            number: parseInt($(item).attr('data-id')),
            episodes: []
          }
        }
      )

      $(".episodes").css("display", "block");

      $("#watch #episodes .bl-servers .episodes").each(
        (key, value) => {
          if (parseInt($(value).attr("data-server")) === ${ServerID.MyCloud}) {
            var seasonId = $(value).attr("data-season")
            $(value).find('li a').each(
              (episodeKey, episodeValue) => {
                seasons[seasonId].episodes.push({
                  number: parseInt($(episodeValue).attr('data-kname').replace(seasonId + ':', '')),
                  path: $(episodeValue).attr('href').replace("${this.baseUri}", ''),
                  title: $(episodeValue).find('span').text().trim(),
                })
              }
            )
          }
        }
      )

      return Object.values(seasons);
    `);
  }

  async getVideoDetails(path: string) {
    const browser = this.createBrowser();
    const selectors = {
      iframe: '#body #watch #player iframe',
      servers: '#watch #episodes .bl-servers',
      serversMovie: '#watch #episodes bl-servers.movie',
    };

    browser.navigate().to(this.baseUri + path);

    await browser.wait(until.elementLocated(By.css(selectors.servers)));

    const type = await this.findVideoType(browser);

    const info = await browser.executeScript(
      `$(".more").click();
      return {
        name: $("#watch .watch-extra .info .title").text().trim(),
        background: $("#watch .play").css("background-image").replace('url(\"', '').replace('\")',''),
        poster: $("#watch .watch-extra .info .poster img").attr("src").replace('-w380', ''),
        description: $("#watch .watch-extra .info .desc").text().trim(),
        imdb: parseFloat($("#watch .watch-extra .info .imdb").text().trim()),
        quality: $("#watch .watch-extra .info .quality").text().trim(),
        // TODO: return related videos
      }`,
    );

    await browser.wait(until.elementLocated(By.css(selectors.iframe)));
    const iframeSrc = await browser.executeScript<string>(
      `return $("${selectors.iframe}").attr("src")`,
    );

    const response = {
      type,
      info,
      seasons:
        type == VideoType.SERIES ? await this.fetchSeasonDetails(browser) : [],
      cdn: await this.getMCloudEmbedDetails(
        _.last(new URL(iframeSrc).pathname.split('/')),
      ),
    };

    browser.close();

    return response;
  }

  // TODO: add parameters
  async search() {
    // TODO: write logic
  }

  async simpleSearch(keyword: string) {
    const response: AxiosResponse<{ html: string }> = await axios.get(
      'ajax/film/search',
      {
        baseURL: this.baseUri,
        params: {
          keyword,
        },
      },
    );

    // TODO: extract information from html response by using Regex or DOM

    return response.data.html;
  }
}
