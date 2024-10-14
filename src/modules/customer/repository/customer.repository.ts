import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { MySQLService } from '../../../core/infrastructure/database/mysql/mysql.service';
import { CustomerProps } from '../domain/customer';
import {
  CustomerDataResponseDto,
  toCustomerDataResponseDto,
} from '../dto/customer-response.dto';

@Injectable()
export class CustomerRepository {
  private readonly tableName = 'customer';

  constructor(private readonly db: MySQLService) {}

  async findOne(id: number): Promise<CustomerDataResponseDto> {
    try {
      const result = await this.db.getRecord(this.tableName, { id });
      if (!result) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return toCustomerDataResponseDto(result) as CustomerDataResponseDto;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(
    limit: number,
    offset: number,
  ): Promise<CustomerDataResponseDto[]> {
    try {
      if (limit === undefined || offset === undefined) {
        const results = await this.db.listRecords(this.tableName, {});
        return toCustomerDataResponseDto(results) as CustomerDataResponseDto[];
      }

      const results = await this.db.listRecordsPaginated(
        this.tableName,
        {},
        limit,
        offset,
      );
      return toCustomerDataResponseDto(results) as CustomerDataResponseDto[];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(customer: CustomerProps): Promise<void> {
    try {
      await this.db.insertRecord(this.tableName, customer);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, customer: CustomerProps): Promise<void> {
    try {
      await this.db.updateRecord(this.tableName, { id }, customer);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.db.deleteRecord(this.tableName, { id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
