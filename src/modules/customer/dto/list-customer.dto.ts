import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ListCustomerDto {
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @Type(() => Number)
  offset: number;
}
