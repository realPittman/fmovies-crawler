import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { searchOptions } from 'src/common/constants/search-options';
import { parse } from 'node-html-parser';
import * as _ from 'lodash';
import { VideoType } from './video.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  private readonly baseUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
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
        href: itemElements[i].getAttribute('href'),
        imdb: parseFloat(
          itemElements[i].querySelector('.imdb').text.trim(),
        ).toFixed(2),
        year,
        details: meta.join(' ').replace('min', 'mins').replace('na mins', ''),
      });
    }

    return items;
  }

  // TODO: add parameters
  async advanced() {
    // TODO: write logic
  }

  options() {
    return searchOptions;
  }
}
