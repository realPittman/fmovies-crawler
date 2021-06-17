import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RequestService {
  private readonly baseUri: string;

  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpService,
  ) {
    this.baseUri = this.configService.get('fmovies.baseUri');
  }

  async getHomePage() {
    return this.httpService
      .get<string>('home', {
        baseURL: this.baseUri,
      })
      .toPromise();
  }
}
