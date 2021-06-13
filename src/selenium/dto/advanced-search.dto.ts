import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import {
  CountrySlugs,
  GenreSlugs,
} from '../../common/constants/search-options';
import { VideoType } from '../providers/video.service';

export class AdvancedSearchDto {
  @IsOptional()
  @IsBoolean()
  include_all_genres?: boolean;

  @IsOptional()
  @IsBoolean()
  with_subtitle?: boolean;

  @IsOptional()
  @IsEnum(GenreSlugs, { each: true, message: 'Invalid genres array.' })
  genres: GenreSlugs[];

  @IsOptional()
  @IsEnum(VideoType, {
    each: true,
    message: `Type can only be "${VideoType.MOVIE}" or "${VideoType.SERIES}"`,
  })
  type: VideoType[];

  @IsOptional()
  @IsEnum(CountrySlugs, { each: true, message: 'Invalid countries array.' })
  countries: CountrySlugs[];

  @IsOptional()
  @IsNumber({ allowNaN: false }, { each: true })
  @IsPositive({ each: true })
  release: number[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  page: number;
}
