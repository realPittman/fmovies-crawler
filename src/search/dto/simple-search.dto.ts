import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class SimpleSearchDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty({ description: 'The keyword query to search' })
  keyword: string;
}
