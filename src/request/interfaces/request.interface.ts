import { VideoType } from '../../selenium/providers/video.service';

export interface SearchParams {
  sort: string;
  genre: number[];
  genre_mode: string;
  type: VideoType;
  country: number[];
  release: number[];
  quality: string[];
  subtitle: number;
  page: number;
}
