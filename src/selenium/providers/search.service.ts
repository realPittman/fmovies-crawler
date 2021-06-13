import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';
import { parse } from 'node-html-parser';
import { searchOptions } from 'src/common/constants/search-options';
import { HomeService } from './home.service';
import { VideoType } from './video.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  private readonly baseUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly homeService: HomeService,
  ) {
    this.baseUri = this.configService.get('fmovies.baseUri');
  }

  async simple(keyword: string) {
    this.logger.debug(`Got the keyword to simple search "${keyword}"`);

    const response = await this.httpService
      .get<{ html: string }>('ajax/film/search', {
        baseURL: this.baseUri,
        params: {
          keyword,
        },
      })
      .toPromise();

    const items = [];

    const itemElements = parse(response.data.html).querySelectorAll('.item');
    for (let i = 0; i < itemElements.length; i++) {
      const meta = itemElements[i]
        .querySelector('.meta')
        .structuredText.trim()
        .split(' ');

      meta.shift();
      const year = parseInt(meta[0]);
      meta.shift();
      const type = _.last(meta) === 'min' ? VideoType.MOVIE : VideoType.SERIES;

      items.push({
        type,
        title: itemElements[i].querySelector('.title').text.trim(),
        poster: itemElements[i]
          .querySelector('.poster img')
          .getAttribute('src')
          .trim()
          .replace('-w100', ''),
        path: itemElements[i].getAttribute('href').replace('/film/', ''),
        imdb: parseFloat(
          itemElements[i].querySelector('.imdb').text.trim(),
        ).toFixed(2),
        year,
        details: meta.join(' ').replace('min', 'mins').replace('na mins', ''),
      });
    }

    return items;
  }

  // TODO: add input parameters
  async advanced() {
    const page = await this.httpService
      .get<string>('filter', {
        baseURL: this.baseUri,
        params: {
          // TODO: handle params
          sort: 'default',
          // genre: [],
          // If this parameter be passed, filter will include all selected genres
          // genre_mode: 'and',
          // type: [],
          // country: [],
          // release: [],
          // quality: [],
          // subtitle: [],
          page: 1,
        },
      })
      .toPromise();

    return parse(page.data)
      .querySelectorAll('.content div.item')
      .map((item) => this.homeService.processItem(item));
  }

  options() {
    return searchOptions;
  }
}
