import { Expose, plainToInstance } from 'class-transformer';

export class PolicyResponseDto {
  @Expose()
  id: string;

  @Expose()
  holder: string;

  @Expose()
  dni: string;

  @Expose()
  address: string;

  @Expose()
  phone: string;

  @Expose()
  vehicleBrand: string;

  @Expose()
  licensePlate: string;

  @Expose()
  manufactureYear: number;

  @Expose()
  insuredAmount: number;

  @Expose()
  premium: number;

  @Expose()
  validityPeriod: string;
}

export class PolicyDataResponseDto {
  @Expose()
  id: string;

  @Expose()
  holder: string;

  @Expose()
  dni: string;

  @Expose()
  address: string;

  @Expose()
  phone: string;

  @Expose()
  vehicleBrand: string;

  @Expose()
  licensePlate: string;

  @Expose()
  manufactureYear: number;

  @Expose()
  insuredAmount: number;

  @Expose()
  premium: number;

  @Expose()
  validityPeriod: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date;
}

export const toPolicyResponseDto = (
  policy: PolicyDataResponseDto | PolicyDataResponseDto[],
): PolicyResponseDto | PolicyResponseDto[] => {
  if (Array.isArray(policy)) {
    return policy.map((p) => toPolicyResponseDto(p)) as PolicyResponseDto[];
  }

  return plainToInstance(PolicyResponseDto, policy, {
    strategy: 'excludeAll',
  });
};

export const toPolicyDataResponseDto = (
  policy: any | any[],
): PolicyDataResponseDto | PolicyDataResponseDto[] => {
  if (Array.isArray(policy)) {
    return policy.map((p) =>
      toPolicyDataResponseDto(p),
    ) as PolicyDataResponseDto[];
  }

  return plainToInstance(PolicyDataResponseDto, policy, {
    strategy: 'excludeAll',
  });
};
