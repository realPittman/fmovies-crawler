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
  WebElement,
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
    try {
      const breadcrumb = await browser.findElement(By.css('.breadcrumb'));
      const items = await breadcrumb.findElements(By.css('.breadcrumb-item'));
      for (let i = 0; i < items.length; i++) {
        switch (await items[i].findElement(By.css('span')).getText()) {
          case 'TV-Series':
            return VideoType.SERIES;
          case 'Movies':
            return VideoType.MOVIE;
        }
      }
    } catch (e) {
      console.log(e);
      throw new Error('Could not find video type');
    }
    throw new Error('Unsupported video type');
  }

  // TODO: add response type
  private async fetchSeasonDetails(browser: ThenableWebDriver) {
    const seasonsItems = await browser.findElements(
      By.css('#watch #episodes .bl-seasons ul li'),
    );

    const seasons = {};
    for (let i = 0; i < seasonsItems.length; i++) {
      const seasonId = _.toNumber(
        await seasonsItems[i].getAttribute('data-id'),
      );
      seasons[seasonId] = {
        number: seasonId,
        episodes: [],
      };
    }

    /**
     * Adding episodes to the seasons
     */
    await browser.executeScript('$(".episodes").css("display", "block");');
    const episodes = await browser.findElements(
      By.css('#watch #episodes .bl-servers .episodes'),
    );

    for (let i = 0; i < episodes.length; i++) {
      // We only want to load episodes from MyCloud server, so we skip others
      if (
        _.toNumber(await episodes[i].getAttribute('data-server')) !==
        ServerID.MyCloud
      ) {
        continue;
      }
      const seasonId = _.toNumber(
        await episodes[i].getAttribute('data-season'),
      );
      const episodeItems = await episodes[i].findElements(By.css('li a'));
      for (let j = 0; j < episodeItems.length; j++) {
        console.log(
          `Adding episode ${j} to season ${seasonId} - ${Date.now()}`,
        );
        seasons[seasonId].episodes.push({
          number: _.toNumber(
            (await episodeItems[j].getAttribute('data-kname')).replace(
              seasonId + ':',
              '',
            ),
          ),
          path: (await episodeItems[j].getAttribute('href')).replace(
            this.baseUri,
            '',
          ),
          title: await episodeItems[j].findElement(By.css('span')).getText(),
        });
      }
    }

    return _.toArray(seasons);
  }

  async getVideoDetails(path: string) {
    const browser = this.createBrowser();
    const selectors = {
      iframe: '#body #watch #player iframe',
      servers: '#watch #episodes .bl-servers',
      serversMovie: '#watch #episodes bl-servers.movie',
    };

    browser.navigate().to(this.baseUri + path);

    await browser.wait(until.elementLocated(By.css(selectors.iframe)));
    const iframeSrc = await browser
      .findElement(By.css(selectors.iframe))
      .getAttribute('src');

    await browser.wait(until.elementLocated(By.css(selectors.servers)));

    const type = await this.findVideoType(browser);

    let seasons;
    if (type == VideoType.SERIES) {
      seasons = await this.fetchSeasonDetails(browser);
    }

    /**
     * Fetching details
     */
    const infoSection = await browser.findElement(
      By.css('#watch .watch-extra .info'),
    );

    const poster = await infoSection
      .findElement(By.css('.poster img'))
      .getAttribute('src');

    const background = await browser.executeScript(
      `return $("#watch .play").css("background-image").replace('url(\"', '').replace('\")','')`,
    );

    const name = await infoSection.findElement(By.css('.title')).getText();
    const quality = await infoSection.findElement(By.css('.quality')).getText();
    const imdb = _.toNumber(
      _.trim(await infoSection.findElement(By.css('.imdb')).getText()),
    );

    // Click on "+ more" button to get full details
    try {
      await browser.executeScript('$(".more").click();');
    } catch (e) {
      // Do nothing, if the button does not exist!
    }

    const description = await infoSection
      .findElement(By.css('.desc'))
      .getText();

    // TODO: get video meta

    browser.close();

    return {
      type,
      name,
      quality,
      imdb,
      poster,
      background,
      description,
      seasons,
      cdn: await this.getMCloudEmbedDetails(
        _.last(new URL(iframeSrc).pathname.split('/')),
      ),
    };
  }
}
