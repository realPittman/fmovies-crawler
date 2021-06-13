import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as _ from 'lodash';

@Injectable()
export class HomeService {
  private readonly logger = new Logger(HomeService.name);

  private readonly baseUri: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUri = this.configService.get('fmovies.baseUri');
  }

  async homepage() {
    // TODO: write logic
  }
}
