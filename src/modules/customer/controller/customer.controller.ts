import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CreateCustomerDto } from '../dto/create-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { IdCustomerDto } from '../dto/id-customer.dto';
import { ListCustomerDto } from '../dto/list-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerService } from '../service/customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<void> {
    await this.customerService.createCustomer(createCustomerDto);
  }

  @Get(':id')
  async getCustomer(
    @Param() idCustomerDto: IdCustomerDto,
  ): Promise<CustomerResponseDto> {
    return this.customerService.getCustomer(idCustomerDto.id);
  }

  @Put(':id')
  async updateCustomer(
    @Param() idCustomerDto: IdCustomerDto,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<void> {
    await this.customerService.updateCustomer(
      idCustomerDto.id,
      updateCustomerDto,
    );
  }

  @Delete(':id')
  async deleteCustomer(@Param() idCustomerDto: IdCustomerDto): Promise<void> {
    await this.customerService.deleteCustomer(idCustomerDto.id);
  }

  @Get()
  async listCustomers(
    @Query() listCustomerDto: ListCustomerDto,
  ): Promise<CustomerResponseDto[]> {
    return this.customerService.listCustomers(listCustomerDto);
  }
}
