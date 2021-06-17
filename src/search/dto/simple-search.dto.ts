import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SimpleSearchDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The keyword query to search' })
  keyword: string;
}
