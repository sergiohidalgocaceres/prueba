import { DynamicModule, Global, Module } from '@nestjs/common';

import { SQSService } from './sqs.service';
import { SQS_OPTIONS } from './sqs.symbols';
import { SQSConfig } from './sqs.type';

@Global()
@Module({})
export class SQSModule {
  static forRoot(options: SQSConfig): DynamicModule {
    return {
      module: SQSModule,
      providers: [
        {
          provide: SQS_OPTIONS,
          useValue: options,
        },
        SQSService,
      ],
      exports: [SQSService],
    };
  }
}
