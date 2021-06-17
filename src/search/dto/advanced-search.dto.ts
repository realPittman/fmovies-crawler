import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { VideoType } from 'src/common/constants/video-types';
import {
  CountrySlugs,
  GenreSlugs,
  QualitySlugs,
  SortSlugs,
} from '../../common/constants/search-options';

export class AdvancedSearchDto {
  @IsOptional()
  @IsEnum(GenreSlugs, { each: true, message: 'Invalid genres array.' })
  @ApiProperty({
    description: 'The genres of the video',
    required: false,
    type: [GenreSlugs],
    enum: GenreSlugs,
    nullable: true,
    default: null,
  })
  genres: GenreSlugs[];

  @IsOptional()
  @IsBooleanString()
  @ApiProperty({
    description: 'Include all selected generes',
    required: false,
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
    required: false,
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
    required: false,
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
    required: false,
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
    required: false,
    type: [Number],
    nullable: true,
    default: null,
  })
  release: number[];

  @IsOptional()
  @IsBooleanString()
  @ApiProperty({
    description: 'Filter videos with or without subtitle, default is disabled',
    required: false,
    type: Boolean,
    nullable: true,
    default: null,
  })
  with_subtitle?: boolean;

  @IsOptional()
  @IsEnum(SortSlugs, { message: 'Invalid sort slug.' })
  @ApiProperty({
    description: 'Order of the items',
    required: false,
    type: String,
    enum: SortSlugs,
    nullable: true,
    default: null,
  })
  sort: SortSlugs;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    description: 'Current page to load',
    required: false,
    minimum: 1,
    nullable: true,
    default: 1,
  })
  page: number;
}
