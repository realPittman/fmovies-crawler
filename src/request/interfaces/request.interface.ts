import { VideoType } from '../../common/constants/video-types';

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
