import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import * as _ from 'lodash';
import { parse } from 'node-html-parser';
import { By, ThenableWebDriver, until } from 'selenium-webdriver';
import { v4 as uuidv4 } from 'uuid';
import { VideoHelper } from '../../common/helpers/video-helper';
import { RequestService } from '../../request/request.service';
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
    private readonly requestService: RequestService,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    this.baseUri = this.configService.get('fmovies.baseUri');
  }

  // Replacing stream url with UUID, cause it's limited to server IP only
  // By using UUID we can reverse proxy the Stream URL to bypass this restriction :)
  private async replaceStreamURLWithUUID(url: string) {
    this.logger.debug('Replacing the streaming URL with UUID', url);
    try {
      // Remove last part of the URL (which is "list.m3u8")
      const urlParts = url.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      delete urlParts[urlParts.length - 1];

      const uuid = uuidv4();
      await this.cacheManager.set(uuid, urlParts.join('/'), {
        ttl: this.configService.get('cache.uuidTTL'),
      });
      return (
        this.configService.get('baseURI') + '/stream/' + uuid + '/' + lastPart
      );
    } catch (err) {
      throw new InternalServerErrorException(
        'Could not generate stream UUID',
        err,
      );
    }
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
      var seasons = [];
      var current_season = null;
      var current_episode = {};

      $('#watch #episodes .bl-seasons ul li').each(
        (key, item) => {
          seasons[$(item).attr('data-id')] = {
            episodes: [],
            season_number: parseInt($(item).attr('data-id')),
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

                // Calculate video id from path
                const path = $(episodeValue).attr('href').replace("${this.baseUri}", '').replace('/film/', '');
                const pathParts = path.split('/');

                var temp = {
                  episode_id: pathParts[pathParts.length - 1], // Episode ID is not video ID! they are different.
                  path,
                  episode_number: parseInt($(episodeValue).attr('data-kname').replace(seasonId + ':', '')),

                  // Sometimes the title is an empty string, in that case we'll return null
                  title: title !== "" ? title : null,
                }

                // If element has "active" class, means current video link is this episode
                // So we'll mark this episode as "active" episode in another variable
                if ($(episodeValue).hasClass('active')) {
                  current_season = parseInt(seasonId) // Current season number
                  current_episode = temp
                }

                seasons[seasonId].episodes.push(temp)
              }
            )
          }
        }
      )

      return {
        current_season,
        current_episode,
        seasons: Object.values(seasons),
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

  async details(path: string) {
    this.logger.debug('Getting video details', path);
    const browser = this.seleniumService.createBrowser();

    try {
      this.logger.debug(`Navigating to URL`, path);
      await browser.navigate().to(this.baseUri + 'film/' + path);
    } catch (err) {
      await browser.close();
      throw new InternalServerErrorException('Could not navigate to website.');
    }

    try {
      await this.executeOptimizationScripts(browser);
    } catch (err) {
      await browser.close();
      throw new InternalServerErrorException(
        'Could not run the optimization script.',
      );
    }

    try {
      this.logger.debug('Waiting for servers to load', path);
      await browser.wait(
        until.elementLocated(By.css('#watch #episodes .bl-servers')),
        20000,
      );
      this.logger.debug('Servers loaded', path);
    } catch (err) {
      await browser.close();
      throw new InternalServerErrorException(
        'Timeout while trying to fetch video servers.',
      );
    }

    this.logger.debug('Finding the video type', path);
    const type = await this.findVideoType(browser);

    const info = await browser.executeScript(`
      var background = $("#watch .play").css("background-image").replace('url(\"', '').replace('\")','');

      // Sometimes background is the same as baseUri which means video doesn't have custom background!
      if (background === "${this.baseUri}") background = undefined;

      // Handle related videos
      var related_videos = [];
      $(".watch-extra .bl-2 .content .item").each((key, item) => {
        var rawType = $(item).find('.meta .type').text();
        var type = rawType.trim().toLowerCase() === 'tv' ? '${VideoType.SERIES}' : '${VideoType.MOVIE}';

        // Calculate id from path
        const path = $(item).find('a').attr('href').replace('/film/', '').replace("${this.baseUri}", '');
        const pathParts = path.split('.');

        related_videos.push({
          id: pathParts[pathParts.length - 1],
          path,
          title: $(item).find('a').attr('title'),
          quality: $(item).find('.quality').text().trim(),
          type,
          details: $(item).find('.meta').text().replace(rawType, '').replace('  ', ' ').trim(),
          imdb: $(item).find('.imdb').text().trim(),
          poster: $(item).find('img').attr('src').replace('-w100', '')
        })
      })

      return {
        id: $("#watch").attr("data-id"),
        name: $("#watch .watch-extra .info .title").text().trim(),
        background,
        poster: $("#watch .watch-extra .info .poster img").attr("src").replace('-w380', ''),
        description: $("#watch .watch-extra .info .desc").text().trim().replace('  less', ''),
        imdb: $("#watch .watch-extra .info .imdb").text().trim(),
        quality: $("#watch .watch-extra .info .quality").text().trim(),
        meta: {
          countries: $(".watch-extra .bl-1 .info .meta div:nth-child(1) span:nth-child(2)").text().trim(),
          genres: $(".watch-extra .bl-1 .info .meta div:nth-child(2) span:nth-child(2)").text().trim(),
          release: $(".watch-extra .bl-1 .info .meta div:nth-child(3) span:nth-child(2)").text().trim(),
          directors: $(".watch-extra .bl-1 .info .meta div:nth-child(4) span:nth-child(2)").text().replace(',', ', ').trim(),
          cast: $(".watch-extra .bl-1 .info .meta div:nth-child(5) span:nth-child(2)").text().trim().replace('  less', ''),
          tags: $(".watch-extra .bl-1 .info .meta div:nth-child(6) span:nth-child(2)").text().trim().replace('  less', '')
        },
        related_videos,
      }`);

    this.logger.debug('Fetching season details', path);
    const series =
      type == VideoType.SERIES ? await this.fetchSeasonDetails(browser) : null;

    const iframeSelector = '#body #watch #player iframe';

    try {
      this.logger.debug('Waiting for iframe video to load', path);
      await browser.wait(until.elementLocated(By.css(iframeSelector)), 20000);
      this.logger.debug('Iframe loaded', path);
    } catch (err) {
      await browser.close();
      throw new InternalServerErrorException(
        'Timeout while trying to fetch iframe video.',
      );
    }

    const iframeSrc = await browser.executeScript<string>(
      `return $("${iframeSelector}").attr("src")`,
    );

    await browser.quit();

    this.logger.debug('Fetching MCloud embed details', path);
    const cdn = await this.requestService.mCloudVideoInfo(
      _.last(new URL(iframeSrc).pathname.split('/')),
    );
    cdn.stream = await this.replaceStreamURLWithUUID(cdn.stream);

    const response = {
      type,
      info,
      series,
      cdn,
    };

    return response;
  }

  async findById(videoId: string) {
    const response = await this.requestService.findVideoById(videoId);

    const root = parse(response.data);

    const quality = root.querySelector('.meta .quality').text.trim();
    const imdb = root.querySelector('.meta .imdb').text.trim();
    const details = root
      .querySelector('.meta')
      .structuredText.replace(imdb, '')
      .replace(quality, '')
      .trim();

    const { id, path } = VideoHelper.processPathAndId(
      root.querySelector('.actions .watchnow').getAttribute('href'),
    );

    return {
      id,
      path,
      title: root.querySelector('.title').text,
      imdb: imdb !== '?' ? imdb : null,
      quality,
      details,
      description: root.querySelector('.desc').text.trim(),
    };
  }
}
