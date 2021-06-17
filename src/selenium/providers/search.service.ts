import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { HTMLElement, parse } from 'node-html-parser';
import { searchOptions } from '../../common/constants/search-options';
import { VideoHelper } from '../../common/helpers/video-helper';
import { RequestService } from '../../request/request.service';
import { AdvancedSearchDto } from '../dto/advanced-search.dto';
import { VideoType } from './video.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly requestService: RequestService) {}

  async simple(keyword: string) {
    this.logger.debug(`Got the keyword to simple search "${keyword}"`);

    const response = await this.requestService.search(keyword);

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

      const { id, path } = VideoHelper.processPathAndId(
        itemElements[i].getAttribute('href'),
      );

      items.push({
        id,
        path,
        type,
        title: itemElements[i].querySelector('.title').text.trim(),
        poster: itemElements[i]
          .querySelector('.poster img')
          .getAttribute('src')
          .trim()
          .replace('-w100', ''),
        imdb: parseFloat(
          itemElements[i].querySelector('.imdb').text.trim(),
        ).toFixed(2),
        year,
        details: meta.join(' ').replace('min', 'mins').replace('na mins', ''),
      });
    }

    return items;
  }

  async advanced(input: AdvancedSearchDto) {
    const params = {
      sort: input.sort ? this.convertSortSlugToKey(input.sort) : 'default',
      genre: this.convertSlugsToNumericKeys('genres', input.genres),
      // If this parameter be passed, filter will include all selected genres
      genre_mode: input.include_all_genres ? 'and' : undefined, // Should be "and" or undefined
      type: input.type,
      country: this.convertSlugsToNumericKeys('countries', input.countries),
      release: input.release,
      quality: this.convertSlugsToStringKeys('qualities', input.qualities),
      subtitle: this.handlerSubtitleParam(input.with_subtitle),
      page: input.page,
    };

    const page = await this.requestService.filter(params);

    const root = parse(page.data);

    return {
      items: root
        .querySelectorAll('.content div.item')
        .map((item) => VideoHelper.processItem(item)),
      meta: this.getPaginationMeta(
        root.querySelectorAll('.content .pagenav li'),
      ),
    };
  }

  private handlerSubtitleParam(input?: boolean) {
    // Return type should be numeric boolean or undefined
    if (input === undefined) return;
    if (input === true) return 1;
    return 0;
  }

  private getPaginationMeta(items: HTMLElement[]) {
    const defaultMeta = {
      currentPage: 1,

      hasNextPage: false,
      nextPage: null,

      hasPreviousPage: false,
      PreviousPage: null,
    };

    for (let i = 0; i < items.length; i++) {
      // If item has "active" class
      if (items[i].classList.contains('active')) {
        defaultMeta.currentPage = parseInt(items[i].text);

        // If the next item is "disabled" means it's the last page
        if (!items[i + 1].classList.contains('disabled')) {
          defaultMeta.hasNextPage = true;
          defaultMeta.nextPage = parseInt(items[i + 1].text);
        }

        // If the previous item is numeric, then it means it has previous page
        if (parseInt(items[i - 1].text)) {
          defaultMeta.hasPreviousPage = true;
          defaultMeta.PreviousPage = parseInt(items[i - 1].text);
        }
      }
    }

    return defaultMeta;
  }

  private convertSlugsToNumericKeys(
    type: 'genres' | 'countries',
    inputs?: string[] | string,
  ) {
    if (!inputs) return;
    if (typeof inputs === 'string') inputs = [inputs];

    return inputs.map(
      (input) =>
        _.first(searchOptions[type].filter((temp) => temp.slug === input)).key,
    );
  }

  private convertSlugsToStringKeys(
    type: 'qualities',
    inputs?: string[] | string,
  ) {
    if (!inputs) return;
    if (typeof inputs === 'string') inputs = [inputs];

    return inputs.map(
      (input) =>
        _.first(searchOptions[type].filter((temp) => temp.slug === input)).key,
    );
  }

  private convertSortSlugToKey(slug: string) {
    if (!slug) return;
    if (typeof slug !== 'string')
      throw new BadRequestException(
        `Parameter "sort" should be type of string.`,
      );

    return _.first(searchOptions.sort.filter((temp) => temp.slug === slug)).key;
  }

  availableOptions() {
    // Remove "key" field from options constant
    ['genres', 'types', 'countries', 'qualities', 'sort'].forEach((option) => {
      searchOptions[option].forEach((v: any) => delete v.key);
    });

    return searchOptions;
  }
}
