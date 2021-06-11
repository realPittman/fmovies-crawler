import { IsNotEmpty, IsString } from 'class-validator';

export class VideoDto {
  @IsString()
  @IsNotEmpty()
  path: string;
}
