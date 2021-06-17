import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VideoDetailsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The path of the video' })
  path: string;
}
