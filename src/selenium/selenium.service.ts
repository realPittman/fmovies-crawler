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

    options.headless();

    // Disable notification prompts
    options.addArguments(
      '--disable-notifications',
      '--enable-heavy-ad-intervention',
      '--enable-parallel-downloading',
      '--enable-lite-video',
      '--enable-quic',
      '--block-new-web-contents', // All pop-ups and calls to window.open will fail
      // '--disable-dev-shm-usage',
    );

    /**
     * Disable all images (performance boost)
     */
    options.setUserPreferences({
      'profile.default_content_settings.images': 2,
      'profile.managed_default_content_settings.images': 2,
    });

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

  // Optimize webpage
  private async executeOptimizationScripts(browser: ThenableWebDriver) {
    this.logger.debug('Executing optimization script');
    return browser.executeScript(`
      $("header.static").remove(); // Remove header (navbar)
      $("[__idm_frm__]").remove(); // Remove top-right-corner ads
      $('footer').remove(); // Remove footer
      $("#comment").remove(); // Remove comment section
      $(".more").click(); // Click on " + more " button to expand details
      $(".container #controls").remove(); // Remove video control panel
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
    await browser.navigate().to(this.baseUri + path);

    await this.executeOptimizationScripts(browser);

    this.logger.debug('Waiting for servers to load');
    await browser.wait(until.elementLocated(By.css(selectors.servers)));
    this.logger.debug('Servers loaded');

    const type = await this.findVideoType(browser);

    const info = await browser.executeScript(`
      var background = $("#watch .play").css("background-image").replace('url(\"', '').replace('\")','');

      // Sometimes background is the same as baseUri which means video doesn't have custom background!
      if (background === "${this.baseUri}") background = undefined;

      return {
        name: $("#watch .watch-extra .info .title").text().trim(),
        background,
        poster: $("#watch .watch-extra .info .poster img").attr("src").replace('-w380', ''),
        description: $("#watch .watch-extra .info .desc").text().trim().replace('  less', ''),
        imdb: parseFloat($("#watch .watch-extra .info .imdb").text().trim()),
        quality: $("#watch .watch-extra .info .quality").text().trim(),
        // TODO: fetch video meta
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
