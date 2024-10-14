import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Injectable } from '@nestjs/common';

import { DynamoDBService } from '../../../core/infrastructure/database/dynamodb/dynamodb.service';
import { CreatePolicyDto } from '../dto/create-policy.dto';
import { UpdatePolicyDto } from '../dto/update-policy.dto';

@Injectable()
export class PolicyRepository {
  private readonly tableName = 'Policies';

  constructor(private readonly dynamoDBService: DynamoDBService) {}

  async create(policy: CreatePolicyDto): Promise<void> {
    const item = marshall(
      { ...policy, createdAt: new Date().toISOString() },
      { convertClassInstanceToMap: true },
    );
    await this.dynamoDBService.insertRecord(this.tableName, item);
  }

  async findAll(): Promise<any[]> {
    const records = await this.dynamoDBService.listRecords(this.tableName, {});
    return records.map((record: any) => unmarshall(record));
  }

  async findOne(id: string): Promise<any> {
    const record = await this.dynamoDBService.getRecord(this.tableName, {
      id: { S: id },
    });
    return unmarshall(record);
  }

  async update(id: string, policy: UpdatePolicyDto): Promise<void> {
    const item = marshall(
      { ...policy, updatedAt: new Date().toISOString() },
      { convertClassInstanceToMap: true },
    );
    await this.dynamoDBService.updateRecord(
      this.tableName,
      { id: { S: id } },
      item,
    );
  }

  async delete(id: string): Promise<void> {
    const item = marshall({ deletedAt: new Date().toISOString() });
    await this.dynamoDBService.updateRecord(
      this.tableName,
      { id: { S: id } },
      item,
    );
  }
}
