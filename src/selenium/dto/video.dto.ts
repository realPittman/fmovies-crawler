import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class VideoDto {
  @IsString()
  @IsDefined()
  @ApiProperty({ description: 'The id of video' })
  id: string;
}
