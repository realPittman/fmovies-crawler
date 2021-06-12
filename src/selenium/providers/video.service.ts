import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import { By, ThenableWebDriver, until } from 'selenium-webdriver';
import { MCloudResponse } from '../types/response.types';
import { SeleniumService } from './selenium.service';

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
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  private readonly baseUri: string;

  constructor(
    private readonly seleniumService: SeleniumService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUri = this.configService.get('fmovies.baseUri');
  }

  private async getMCloudEmbedDetails(videoCode: string) {
    this.logger.debug('Fetching MGCloud embed details');
    const response = await this.httpService
      .get<MCloudResponse>(`https://mcloud.to/info/${videoCode}`, {
        headers: {
          // This header is required, otherwise MCloud will return an empty response
          referer: 'https://mcloud.to/',
        },
      })
      .toPromise();

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
      var current = {};

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
                var title = $(episodeValue).find('span').text().trim()

                var temp = {
                  number: parseInt($(episodeValue).attr('data-kname').replace(seasonId + ':', '')),
                  path: $(episodeValue).attr('href').replace("${this.baseUri}", ''),

                  // Sometimes the title is an empty string, in that case we'll return null
                  title: title !== "" ? title : null,
                }

                // If element has "active" class, means current video link is this episode
                // So we'll mark this episode as "active" episode in another variable
                if ($(episodeValue).hasClass('active')) {
                  current = {
                    number: parseInt(seasonId), // Current season number
                    episode: temp
                  }
                }

                seasons[seasonId].episodes.push(temp)
              }
            )
          }
        }
      )

      return {
        current,
        items: Object.values(seasons),
      };
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
    const browser = this.seleniumService.createBrowser();

    this.logger.debug(`Navigating to path ${path}`);
    await browser.navigate().to(this.baseUri + path);

    await this.executeOptimizationScripts(browser);

    this.logger.debug('Waiting for servers to load');
    await browser.wait(
      until.elementLocated(By.css('#watch #episodes .bl-servers')),
    );
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
      type == VideoType.SERIES ? await this.fetchSeasonDetails(browser) : {};

    const iframeSelector = '#body #watch #player iframe';

    this.logger.debug('Waiting for iframe video to load');
    await browser.wait(until.elementLocated(By.css(iframeSelector)));
    this.logger.debug('Iframe loaded');

    const iframeSrc = await browser.executeScript<string>(
      `return $("${iframeSelector}").attr("src")`,
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
}
