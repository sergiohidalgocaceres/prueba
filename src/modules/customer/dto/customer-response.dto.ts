import { Expose, plainToInstance } from 'class-transformer';

export class CustomerResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  birthDate?: Date;
}

export class CustomerDataResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  birthDate: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date;
}

export const toCustomerResponseDto = (
  customer: CustomerDataResponseDto | CustomerDataResponseDto[],
): CustomerResponseDto | CustomerResponseDto[] => {
  if (Array.isArray(customer)) {
    return customer.map((c) =>
      toCustomerResponseDto(c),
    ) as CustomerResponseDto[];
  }

  return plainToInstance(CustomerResponseDto, customer, {
    strategy: 'excludeAll',
  });
};

export const toCustomerDataResponseDto = (
  customer: any | any[],
): CustomerDataResponseDto | CustomerDataResponseDto[] => {
  if (Array.isArray(customer)) {
    return customer.map((c) =>
      toCustomerDataResponseDto(c),
    ) as CustomerDataResponseDto[];
  }

  return plainToInstance(CustomerDataResponseDto, customer, {
    strategy: 'excludeAll',
  });
};
