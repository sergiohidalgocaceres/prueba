import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdatePolicyDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  holder: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(8)
  dni: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  address: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  phone: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  vehicleBrand: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(10)
  licensePlate: string;

  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Type(() => Number)
  manufactureYear: number;

  @IsOptional()
  @IsNumber()
  @Min(100)
  @Type(() => Number)
  insuredAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Type(() => Number)
  premium: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  validityPeriod: string;
}
