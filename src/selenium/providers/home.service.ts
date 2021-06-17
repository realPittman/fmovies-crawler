import { Injectable } from '@nestjs/common';
import parse, { HTMLElement } from 'node-html-parser';
import { RequestService } from '../../request/request.service';
import { VideoHelper } from '../../common/helpers/video-helper';

@Injectable()
export class HomeService {
  constructor(private readonly requestService: RequestService) {}

  async homepage() {
    const page = await this.requestService.home();
    const root = parse(page.data);

    return {
      slider: this.processSlider(
        root.querySelectorAll('.swiper-wrapper > div.item'),
      ),
      ...this.processSections(
        root.querySelectorAll('#body > div.container > section.bl'),
      ),
    };
  }

  private processSlider(items: HTMLElement[]) {
    return items.map((item) => {
      const categories = item
        .querySelectorAll('.container .info .meta a')
        .map((category) => category.text);

      const { id, path } = VideoHelper.processPathAndId(
        item.querySelector('.container .info .watchnow').getAttribute('href'),
      );

      return {
        id,
        path,
        background: item.getAttribute('data-src'),
        title: item.querySelector('.container .info .title').text.trim(),
        quality: item
          .querySelector('.container .info .meta .quality')
          .text.trim(),
        imdb: item.querySelector('.container .info .meta .imdb').text.trim(),
        description: item.querySelector('.container .info .desc').text.trim(),
        categories,
      };
    });
  }

  private processSections(items: HTMLElement[]) {
    return {
      recommended: this.processRecommendedSection(items[0]),
      movies: this.processNormalSection(items[1]),
      series: this.processNormalSection(items[2]),
      requested: this.processNormalSection(items[3]),
    };
  }

  private processRecommendedSection(section: HTMLElement) {
    return {
      movies: this.processRecommendedSectionContent(
        section.querySelector('.content[data-name="movies"]'),
      ),
      series: this.processRecommendedSectionContent(
        section.querySelector('.content[data-name="shows"]'),
      ),
      trending: this.processRecommendedSectionContent(
        section.querySelector('.content[data-name="trending"]'),
      ),
    };
  }

  private processRecommendedSectionContent(content: HTMLElement) {
    return content
      .querySelectorAll('div.item')
      .map((item) => VideoHelper.processItem(item));
  }

  private processNormalSection(section: HTMLElement) {
    return section
      .querySelectorAll('.content div.item')
      .map((item) => VideoHelper.processItem(item));
  }
}
