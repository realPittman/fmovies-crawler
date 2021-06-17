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
    return items.map((item) => {
      const categories = item
        .querySelectorAll('.container .info .meta a')
        .map((category) => category.text);

      const { id, path } = this.calculatePath(
        item.querySelector('.container .info .watchnow').getAttribute('href'),
      );

      return {
        id,
        path,
        background: item.getAttribute('data-src'),
        title: item.querySelector('.container .info .title').text.trim(),
        quality: item
          .querySelector('.container .info .meta .quality')
          .text.trim(),
        imdb: item.querySelector('.container .info .meta .imdb').text.trim(),
        description: item.querySelector('.container .info .desc').text.trim(),
        categories,
      };
    });
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
    return content
      .querySelectorAll('div.item')
      .map((item) => this.processItem(item));
  }

  private processNormalSection(section: HTMLElement) {
    return section
      .querySelectorAll('.content div.item')
      .map((item) => this.processItem(item));
  }

  processItem(item: HTMLElement) {
    const type = item.querySelector('.meta .type').text.trim();
    const description = item
      .querySelector('.meta')
      .structuredText.replace(type, '')
      .trim();

    const { id, path } = this.calculatePath(
      item.querySelector('a.poster').getAttribute('href'),
    );

    return {
      id,
      path,
      title: item.querySelector('.title').text.trim(),
      quality: item.querySelector('.quality').text,
      poster: item
        .querySelector('img')
        .getAttribute('src')
        .replace('-w180', ''),
      imdb: item.querySelector('.imdb').text.trim(),
      type: type === 'TV' ? VideoType.SERIES : VideoType.MOVIE,
      description,
    };
  }

  // TODO: move to helper class
  calculatePath(path: string) {
    const pathParts = path.split('.');

    return {
      id: pathParts[pathParts.length - 1],
      path: path.replace('/film/', ''),
    };
  }
}
