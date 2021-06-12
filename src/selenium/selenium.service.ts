import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
import { Options } from 'selenium-webdriver/chrome';
import { MCloudResponse } from './types/response.types';

const caps = new Capabilities();
caps.setPageLoadStrategy('eager');

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
  private readonly logger = new Logger(SeleniumService.name);

  private readonly baseUri: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUri = this.configService.get('fmovies.baseUri');
  }

  private createBrowser() {
    this.logger.debug('Creating browser');
    const options = new Options();
    options.addArguments('--disable-notifications');
    // options.addArguments('--disable-dev-shm-usage');
    // options.headless();

    return new Builder()
      .withCapabilities(caps)
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }

  private async getMCloudEmbedDetails(videoCode: string) {
    this.logger.debug('Fetching MGCloud embed details');
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

    this.logger.debug('Returning MGCloud embed details');
    return cdn;
  }

  private async findVideoType(browser: ThenableWebDriver): Promise<VideoType> {
    this.logger.debug('Finding the video type');
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
    this.logger.debug('Fetching season details');
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
    this.logger.debug('Getting video details');
    const browser = this.createBrowser();
    const selectors = {
      iframe: '#body #watch #player iframe',
      servers: '#watch #episodes .bl-servers',
      serversMovie: '#watch #episodes bl-servers.movie',
    };

    this.logger.debug(`Navigating to path ${path}`);
    browser.navigate().to(this.baseUri + path);

    this.logger.debug('Executing optimization script');
    // Optimize webpage
    await browser.executeScript(`
      $("[__idm_frm__]").remove(); // Remove ads
      $('footer').remove(); // Remove footer
      $("#comment").remove(); // Remove comment section
      $(".more").click(); // Click on " + more " button to expand details
    `);
    this.logger.debug('Optimization script executed');

    this.logger.debug('Waiting for servers to load');
    await browser.wait(until.elementLocated(By.css(selectors.servers)));
    this.logger.debug('Servers loaded');

    const type = await this.findVideoType(browser);

    const info = await browser.executeScript(`
      return {
        name: $("#watch .watch-extra .info .title").text().trim(),
        background: $("#watch .play").css("background-image").replace('url(\"', '').replace('\")',''),
        poster: $("#watch .watch-extra .info .poster img").attr("src").replace('-w380', ''),
        description: $("#watch .watch-extra .info .desc").text().trim().replace('  less', ''),
        imdb: parseFloat($("#watch .watch-extra .info .imdb").text().trim()),
        quality: $("#watch .watch-extra .info .quality").text().trim(),
        // TODO: return related videos
      }`);

    const seasons =
      type == VideoType.SERIES ? await this.fetchSeasonDetails(browser) : [];

    this.logger.debug('Waiting for iframe video to load');
    await browser.wait(until.elementLocated(By.css(selectors.iframe)));
    this.logger.debug('Iframe loaded');

    const iframeSrc = await browser.executeScript<string>(
      `return $("${selectors.iframe}").attr("src")`,
    );

    const response = {
      type,
      info,
      seasons,
      cdn: await this.getMCloudEmbedDetails(
        _.last(new URL(iframeSrc).pathname.split('/')),
      ),
    };

    await browser.quit();

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
