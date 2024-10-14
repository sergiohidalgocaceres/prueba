import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePolicyDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  holder: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(8)
  dni: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  address: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  phone: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  vehicleBrand: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  licensePlate: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(2000)
  @Type(() => Number)
  manufactureYear: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(100)
  @Type(() => Number)
  insuredAmount: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(10)
  @Type(() => Number)
  premium: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  validityPeriod: string;
}
