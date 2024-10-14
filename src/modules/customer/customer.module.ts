import { Module } from '@nestjs/common';

import { CustomerController } from './controller/customer.controller';
import { CustomerRepository } from './repository/customer.repository';
import { CustomerService } from './service/customer.service';

// src/customer/customer.module.ts
@Module({
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
