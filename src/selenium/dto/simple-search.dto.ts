import { IsNotEmpty, IsString } from 'class-validator';

export class SimpleSearchDto {
  @IsString()
  @IsNotEmpty()
  keyword: string;
}
