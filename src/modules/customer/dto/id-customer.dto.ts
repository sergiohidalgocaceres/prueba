import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class IdCustomerDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;
}
