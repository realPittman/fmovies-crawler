import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

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

  async simpleSearch(keyword: string) {
    this.logger.debug(`Got the keyword to simple search "${keyword}"`);

    const response = await this.httpService
      .get<{ html: any }>('ajax/film/search', {
        baseURL: this.baseUri,
        params: {
          keyword,
        },
      })
      .toPromise();

    // TODO: extract information from html response by using Regex or DOM

    return response.data.html;
  }

  // TODO: add parameters
  async search() {
    // TODO: write logic
  }
}
