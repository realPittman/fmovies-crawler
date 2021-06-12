import { Injectable, Logger } from '@nestjs/common';
import 'chromedriver';
import { Builder, Capabilities, ThenableWebDriver } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/chrome';

const caps = new Capabilities();
caps.setPageLoadStrategy('eager');

@Injectable()
export class SeleniumService {
  private readonly logger = new Logger(SeleniumService.name);

  createBrowser(): ThenableWebDriver {
    this.logger.debug('Creating browser');
    const options = new Options();

    options.headless();

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

    return new Builder()
      .withCapabilities(caps)
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();
  }
}
