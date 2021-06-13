import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import parse, { HTMLElement } from 'node-html-parser';

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
    const sections = root.querySelectorAll('#body > div.container > section');

    return {
      slider: this.processSlider(
        root.querySelectorAll('.swiper-wrapper > div.item'),
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
}
