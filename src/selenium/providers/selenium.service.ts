import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'chromedriver';
import { Builder, Capabilities, ThenableWebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

const caps = new Capabilities();
caps.setPageLoadStrategy('eager');

@Injectable()
export class SeleniumService {
  private readonly logger = new Logger(SeleniumService.name);

  constructor(private readonly configService: ConfigService) {}

  createBrowser(): ThenableWebDriver {
    this.logger.debug('Creating browser');
    const options = new Options();

    if (this.configService.get('selenium.headless')) {
      options.headless();
    }

    // Disable notification prompts
    options.addArguments(
      '--disable-notifications',
      '--enable-heavy-ad-intervention',
      '--enable-parallel-downloading',
      '--enable-lite-video',
      '--enable-quic',
      '--block-new-web-contents', // All pop-ups and calls to window.open will fail
      // '--disable-dev-shm-usage',
    );

    /**
     * Disable all images (performance boost)
     */
    options.setUserPreferences({
      'profile.default_content_settings.images': 2,
      'profile.managed_default_content_settings.images': 2,
    });

    try {
      return new Builder()
        .withCapabilities(caps)
        .forBrowser('chrome')
        .setChromeOptions(options)
        .build();
    } catch (err) {
      this.logger.error('Could not create browser instance.', err);
      throw new InternalServerErrorException(
        'Could not create browser instance.',
      );
    }
  }
}
