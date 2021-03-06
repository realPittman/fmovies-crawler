import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import 'chromedriver';
import { Builder, Capabilities, ThenableWebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

@Injectable()
export class SeleniumService implements OnModuleInit {
  private readonly logger = new Logger(SeleniumService.name);
  private caps = new Capabilities();
  private options = new Options();

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.caps.setPageLoadStrategy('eager');

    if (this.configService.get('selenium.headless')) {
      this.options.headless();
    }

    // Disable notification prompts
    this.options.addArguments(
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
    this.options.setUserPreferences({
      'profile.default_content_settings.images': 2,
      'profile.managed_default_content_settings.images': 2,
    });
  }

  createBrowser(): ThenableWebDriver {
    try {
      this.logger.debug('Creating browser');

      const browser = new Builder()
        .withCapabilities(this.caps)
        .forBrowser('chrome')
        .setChromeOptions(this.options)
        .build();

      this.logger.debug('Successfully created browser');
      return browser;
    } catch (err) {
      this.logger.error('Could not create browser instance.', err);

      throw new InternalServerErrorException(
        'Could not create browser instance.',
        err,
      );
    }
  }
}
