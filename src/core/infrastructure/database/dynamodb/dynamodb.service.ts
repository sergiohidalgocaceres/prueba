import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { Inject, Injectable } from '@nestjs/common';

import { DYNAMODB_OPTIONS } from './dynamodb.symbols';
import { DynamoDBConfig } from './dynamodb.type';

@Injectable()
export class DynamoDBService {
  private readonly config: DynamoDBConfig;
  private readonly client: DynamoDBClient;

  constructor(@Inject(DYNAMODB_OPTIONS) options: DynamoDBConfig) {
    this.config = options;
    this.client = new DynamoDBClient({ region: this.config.region });
  }

  async getRecord(tableName: string, key: Record<string, any>): Promise<any> {
    const command = new GetItemCommand({
      TableName: tableName,
      Key: key,
    });
    const response = await this.client.send(command);
    return response.Item;
  }

  async listRecords(
    tableName: string,
    filters: Record<string, any> = {},
    orderBy?: string[],
  ): Promise<any[]> {
    const filterExpression = Object.keys(filters)
      .map((key) => `${key} = :${key}`)
      .join(' AND ');
    const expressionAttributeValues = Object.keys(filters).reduce(
      (acc: Record<string, any>, key) => {
        acc[`:${key}`] = filters[key];
        return acc;
      },
      {} as Record<string, any>,
    );

    const command = new ScanCommand({
      TableName: tableName,
      ...(filterExpression && { FilterExpression: filterExpression }),
      ...(Object.keys(expressionAttributeValues).length > 0 && {
        ExpressionAttributeValues: expressionAttributeValues,
      }),
    });
    const response = await this.client.send(command);
    return response.Items ?? [];
  }

  async insertRecord(
    tableName: string,
    record: Record<string, any>,
  ): Promise<void> {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: record,
    });
    await this.client.send(command);
  }

  async updateRecord(
    tableName: string,
    key: Record<string, any>,
    record: Record<string, any>,
  ): Promise<void> {
    const updateExpression = `SET ${Object.keys(record)
      .map((key) => `${key} = :${key}`)
      .join(', ')}`;
    const expressionAttributeValues = Object.keys(record).reduce(
      (acc: Record<string, any>, key) => {
        acc[`:${key}`] = record[key];
        return acc;
      },
      {} as Record<string, any>,
    );

    console.log('command', {
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    const command = new UpdateItemCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    });
    await this.client.send(command);
  }

  async deleteRecord(
    tableName: string,
    key: Record<string, any>,
  ): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: tableName,
      Key: key,
    });
    await this.client.send(command);
  }
}
