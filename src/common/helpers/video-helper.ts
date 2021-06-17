import { HTMLElement } from 'node-html-parser';
import { VideoType } from '../../selenium/providers/video.service';

export class VideoHelper {
  static processPathAndId(path: string) {
    path = path.trim();
    const pathParts = path.split('.');

    return {
      id: pathParts[pathParts.length - 1],
      path: path.replace('/film/', ''),
    };
  }

  static processImage(src: string) {
    return src.trim().replace('-w180', '');
  }

  static processItem(item: HTMLElement) {
    const type = item.querySelector('.meta .type').text.trim();
    const description = item
      .querySelector('.meta')
      .structuredText.replace(type, '')
      .trim();

    const { id, path } = VideoHelper.processPathAndId(
      item.querySelector('a.poster').getAttribute('href'),
    );

    return {
      id,
      path,
      title: item.querySelector('.title').text.trim(),
      quality: item.querySelector('.quality').text,
      poster: item
        .querySelector('img')
        .getAttribute('src')
        .replace('-w180', ''),
      imdb: item.querySelector('.imdb').text.trim(),
      type: type === 'TV' ? VideoType.SERIES : VideoType.MOVIE,
      description,
    };
  }
}
