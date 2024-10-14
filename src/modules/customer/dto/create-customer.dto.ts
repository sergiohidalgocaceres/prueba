import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(45)
  firstName: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(45)
  lastName: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;
}
