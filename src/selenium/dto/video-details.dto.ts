import { IsNotEmpty, IsString } from 'class-validator';

export class VideoDetailsDto {
  @IsString()
  @IsNotEmpty()
  path: string;
}
