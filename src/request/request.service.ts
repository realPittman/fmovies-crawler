import {
  HttpService,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MCloudResponse } from './interfaces/response.interface';
import { SearchParams } from './interfaces/request.interface';

@Injectable()
export class RequestService {
  private readonly logger = new Logger(RequestService.name);

  private readonly baseUri: string;

  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.baseUri = this.configService.get('fmovies.baseUri');
  }

  async home() {
    this.logger.debug('Getting homepage');

    return this.httpService
      .get<string>('home', {
        baseURL: this.baseUri,
      })
      .toPromise();
  }

  async search(keyword: string) {
    this.logger.debug(`Searching keyword "${keyword}"`);

    return this.httpService
      .get<{ html: string }>('ajax/film/search', {
        baseURL: this.baseUri,
        params: {
          keyword,
        },
      })
      .toPromise();
  }

  async filter(params: SearchParams) {
    this.logger.debug(
      `Filtering with these params '${JSON.stringify(params)}'`,
    );

    return this.httpService
      .get<string>('filter', {
        baseURL: this.baseUri,
        params,
      })
      .toPromise();
  }

  async findVideoById(id: string) {
    return this.httpService
      .get<string>(`ajax/film/tooltip/${id}`, {
        baseURL: this.baseUri,
      })
      .toPromise()
      .catch((err) => {
        throw new InternalServerErrorException('Invalid video id.', err);
      });
  }

  async mCloudVideoInfo(videoCode: string) {
    const response = await this.httpService
      .get<MCloudResponse>(`https://mcloud.to/info/${videoCode}`, {
        headers: {
          // This header is required, otherwise MCloud will return an empty response
          referer: 'https://mcloud.to/',
        },
      })
      .toPromise()
      .catch((err) => {
        throw new InternalServerErrorException(
          'Video maybe got deleted by the owner or was removed due a copyright violation',
          err,
        );
      });

    const cdn = {
      download: null,
      stream: null,
    };

    response.data.media.sources.forEach((source) => {
      if (source.label) {
        cdn.download = source.file;
      } else {
        cdn.stream = source.file;
      }
    });

    this.logger.debug('Returning MCloud embed details');
    return cdn;
  }
}
