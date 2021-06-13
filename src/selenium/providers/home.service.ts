import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import parse, { HTMLElement } from 'node-html-parser';
import { VideoType } from './video.service';

@Injectable()
export class HomeService {
  private readonly baseUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUri = this.configService.get('fmovies.baseUri');
  }

  private async getHomePage() {
    return this.httpService
      .get<string>('home', {
        baseURL: this.baseUri,
      })
      .toPromise();
  }

  async homepage() {
    const page = await this.getHomePage();
    const root = parse(page.data);

    return {
      slider: this.processSlider(
        root.querySelectorAll('.swiper-wrapper > div.item'),
      ),
      ...this.processSections(
        root.querySelectorAll('#body > div.container > section.bl'),
      ),
    };
  }

  private processSlider(items: HTMLElement[]) {
    const response = [];

    for (let i = 0; i < items.length; i++) {
      const categories = [];
      items[i]
        .querySelectorAll('.container .info .meta a')
        .forEach((category) => {
          categories.push(category.text);
        });
      response.push({
        background: items[i].getAttribute('data-src'),
        title: items[i].querySelector('.container .info .title').text.trim(),
        quality: items[i]
          .querySelector('.container .info .meta .quality')
          .text.trim(),
        imdb: items[i]
          .querySelector('.container .info .meta .imdb')
          .text.trim(),
        description: items[i]
          .querySelector('.container .info .desc')
          .text.trim(),
        categories,
        path: items[i]
          .querySelector('.container .info .watchnow')
          .getAttribute('href'),
      });
    }

    return response;
  }

  private processSections(items: HTMLElement[]) {
    return {
      recommend: this.processRecommendedSection(items[0]),
      movies: this.processNormalSection(items[1]),
      series: this.processNormalSection(items[2]),
      requested: this.processNormalSection(items[3]),
    };
  }

  private processRecommendedSection(section: HTMLElement) {
    // TODO: write logic
  }

  private processNormalSection(section: HTMLElement) {
    const response = [];

    const items = section.querySelectorAll('.content div.item');
    for (let i = 0; i < items.length; i++) {
      const type = items[i].querySelector('.meta .type').text.trim();
      const description = items[i]
        .querySelector('.meta')
        .structuredText.replace(type, '')
        .trim();
      response.push({
        title: items[i].querySelector('.title').text.trim(),
        quality: items[i].querySelector('.quality').text,
        path: items[i]
          .querySelector('a.poster')
          .getAttribute('href')
          .replace('/film/', ''),
        poster: items[i]
          .querySelector('img')
          .getAttribute('src')
          .replace('-w180', ''),
        imdb: items[i].querySelector('.imdb').text.trim(),
        type: type === 'TV' ? VideoType.SERIES : VideoType.MOVIE,
        description,
      });
    }

    return response;
  }
}
