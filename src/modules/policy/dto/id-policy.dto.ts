import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class IdPolicyDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  id: string;
}
