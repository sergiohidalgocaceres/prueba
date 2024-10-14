export type CustomerPropsEssential = {
  firstName: string;
  lastName: string;
};

export type CustomerPropsOptional = {
  id: number;
  birthDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type CustomerProps = CustomerPropsEssential &
  Partial<CustomerPropsOptional>;

export class Customer {
  private readonly id: number;
  private firstName: string;
  private lastName: string;
  private birthDate: Date | undefined;
  private readonly createdAt: Date;
  private updatedAt: Date | undefined;
  private deletedAt: Date | undefined;

  constructor(props: CustomerProps) {
    Object.assign(this, props);
  }

  get properties() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      birthDate: this.birthDate,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}
