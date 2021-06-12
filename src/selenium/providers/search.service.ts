import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SearchService {
  private readonly baseUri: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUri = this.configService.get('fmovies.baseUri');
  }

  async simpleSearch(keyword: string) {
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
