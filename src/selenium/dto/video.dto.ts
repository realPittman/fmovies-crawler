import { IsDefined, IsString } from 'class-validator';

export class VideoDto {
  @IsString()
  @IsDefined()
  id: string;
}
