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
    return response.data.media.sources;
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

  // https://stackoverflow.com/questions/39741076
  private async getTextNode(e: WebElement) {
    let text = _.trim(await e.getText());
    const children = await e.findElements(By.xpath('./*'));
    for (let i = 0; i < children.length; i++) {
      text = _.trim(text.replace(await children[i].getText(), ''));
    }
    return text;
  }

  // TODO: add response type
  private async fetchSeasonDetails(browser: ThenableWebDriver) {
    const episodes = await browser.findElement(By.css('#watch #episodes'));

    const seasonsItems = await browser.findElements(
      By.css('#watch #episodes .bl-seasons ul li'),
    );

    const seasons = [];
    for (let i = 0; i < seasonsItems.length; i++) {
      seasons.push({
        id: _.toNumber(await seasonsItems[i].getAttribute('data-id')),
        name: await this.getTextNode(seasonsItems[i]),
      });
    }
    return seasons;
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

    browser.close();

    return {
      type,
      seasons,
      MCloud: await this.getMCloudEmbedDetails(
        _.last(new URL(iframeSrc).pathname.split('/')),
      ),
    };
  }
}
