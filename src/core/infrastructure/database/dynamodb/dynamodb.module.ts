import { DynamicModule, Global, Module } from '@nestjs/common';

import { DynamoDBService } from './dynamodb.service';
import { DYNAMODB_OPTIONS } from './dynamodb.symbols';
import { DynamoDBConfig } from './dynamodb.type';

@Global()
@Module({})
export class DynamoDBModule {
  static forRoot(options: DynamoDBConfig): DynamicModule {
    return {
      module: DynamoDBModule,
      providers: [
        {
          provide: DYNAMODB_OPTIONS,
          useValue: options,
        },
        DynamoDBService,
      ],
      exports: [DynamoDBService],
    };
  }
}
