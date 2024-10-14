import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateCustomerDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(45)
  firstName: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(45)
  lastName: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;
}
