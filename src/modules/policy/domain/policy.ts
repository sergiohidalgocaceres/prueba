export type PolicyPropsEssential = {
  id: string;
  holder: string;
  dni: string;
  address: string;
  phone: string;
  vehicleBrand: string;
  licensePlate: string;
  manufactureYear: number;
  insuredAmount: number;
  premium: number;
  validityPeriod: string;
};

export type PolicyPropsOptional = {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type PolicyProps = PolicyPropsEssential & Partial<PolicyPropsOptional>;

export class Policy {
  private readonly id: string;
  private holder: string;
  private dni: string;
  private address: string;
  private phone: string;
  private vehicleBrand: string;
  private licensePlate: string;
  private manufactureYear: number;
  private insuredAmount: number;
  private premium: number;
  private validityPeriod: string;
  private readonly createdAt: Date;
  private updatedAt: Date | undefined;
  private deletedAt: Date | undefined;

  constructor(props: PolicyProps) {
    Object.assign(this, props);
    this.createdAt = props.createdAt || new Date();
  }

  get properties() {
    return {
      id: this.id,
      holder: this.holder,
      dni: this.dni,
      address: this.address,
      phone: this.phone,
      vehicleBrand: this.vehicleBrand,
      licensePlate: this.licensePlate,
      manufactureYear: this.manufactureYear,
      insuredAmount: this.insuredAmount,
      premium: this.premium,
      validityPeriod: this.validityPeriod,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}
