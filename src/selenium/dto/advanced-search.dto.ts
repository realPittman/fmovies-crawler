import { ApiProperty } from '@nestjs/swagger';
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
  QualitySlugs,
  SortSlugs,
} from '../../common/constants/search-options';
import { VideoType } from '../providers/video.service';

export class AdvancedSearchDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Filter videos with or without subtitle, default is disabled',
    type: Boolean,
    nullable: true,
    default: null,
  })
  with_subtitle?: boolean;

  @IsOptional()
  @IsEnum(GenreSlugs, { each: true, message: 'Invalid genres array.' })
  @ApiProperty({
    description: 'The genres of the video',
    type: [String],
    enum: GenreSlugs,
    nullable: true,
    default: null,
  })
  genres: GenreSlugs[];

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Include all selected generes',
    type: Boolean,
    nullable: true,
    default: null,
  })
  include_all_genres?: boolean;

  @IsOptional()
  @IsEnum(VideoType, {
    message: `Type can only be "${VideoType.MOVIE}" or "${VideoType.SERIES}"`,
  })
  @ApiProperty({
    description: 'The type of the video',
    type: String,
    enum: VideoType,
    nullable: true,
    default: null,
  })
  type: VideoType;

  @IsOptional()
  @IsEnum(CountrySlugs, { each: true, message: 'Invalid countries array.' })
  @ApiProperty({
    description: 'The countries of the video',
    type: [String],
    enum: CountrySlugs,
    nullable: true,
    default: null,
  })
  countries: CountrySlugs[];

  @IsOptional()
  @IsEnum(QualitySlugs, { each: true, message: 'Invalid qualities array.' })
  @ApiProperty({
    description: 'The qualities of the video',
    type: [String],
    enum: QualitySlugs,
    nullable: true,
    default: null,
  })
  qualities: QualitySlugs[];

  @IsOptional()
  @IsNumber({ allowNaN: false }, { each: true })
  @IsPositive({ each: true })
  @ApiProperty({
    description: 'The release-years of the video',
    type: [Number],
    nullable: true,
    default: null,
  })
  release: number[];

  @IsOptional()
  @IsEnum(SortSlugs, { message: 'Invalid sort slug.' })
  @ApiProperty({
    description: 'Order of the items',
    type: String,
    enum: SortSlugs,
    nullable: true,
    default: null,
  })
  sort: SortSlugs;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    minimum: 1,
    nullable: true,
    default: 1,
  })
  page: number;
}
