import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import parse, { HTMLElement } from 'node-html-parser';
import { VideoType } from './video.service';

@Injectable()
export class HomeService {
  private readonly baseUri: string;
  private readonly homePath = 'home';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUri = this.configService.get('fmovies.baseUri');
  }

  private async getHomePage() {
    return this.httpService
      .get<string>(this.homePath, {
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
      recommended: this.processRecommendedSection(items[0]),
      movies: this.processNormalSection(items[1]),
      series: this.processNormalSection(items[2]),
      requested: this.processNormalSection(items[3]),
    };
  }

  private processRecommendedSection(section: HTMLElement) {
    return {
      movies: this.processRecommendedSectionContent(
        section.querySelector('.content[data-name="movies"]'),
      ),
      series: this.processRecommendedSectionContent(
        section.querySelector('.content[data-name="shows"]'),
      ),
      trending: this.processRecommendedSectionContent(
        section.querySelector('.content[data-name="trending"]'),
      ),
    };
  }

  private processRecommendedSectionContent(content: HTMLElement) {
    const response = [];

    content
      .querySelectorAll('div.item')
      .forEach((item) => response.push(this.processItem(item)));

    return response;
  }

  private processNormalSection(section: HTMLElement) {
    const response = [];

    section
      .querySelectorAll('.content div.item')
      .forEach((item) => response.push(this.processItem(item)));

    return response;
  }

  private processItem(item: HTMLElement) {
    const type = item.querySelector('.meta .type').text.trim();
    const description = item
      .querySelector('.meta')
      .structuredText.replace(type, '')
      .trim();
    return {
      title: item.querySelector('.title').text.trim(),
      quality: item.querySelector('.quality').text,
      path: item
        .querySelector('a.poster')
        .getAttribute('href')
        .replace('/film/', ''),
      poster: item
        .querySelector('img')
        .getAttribute('src')
        .replace('-w180', ''),
      imdb: item.querySelector('.imdb').text.trim(),
      type: type === 'TV' ? VideoType.SERIES : VideoType.MOVIE,
      description,
    };
  }
}
