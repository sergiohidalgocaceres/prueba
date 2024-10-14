import { DynamicModule, Global, Module } from '@nestjs/common';

import { SNSService } from './sns.service';
import { SNS_OPTIONS } from './sns.symbols';
import { SNSConfig } from './sns.type';

@Global()
@Module({})
export class SNSModule {
  static forRoot(options: SNSConfig): DynamicModule {
    return {
      module: SNSModule,
      providers: [
        {
          provide: SNS_OPTIONS,
          useValue: options,
        },
        SNSService,
      ],
      exports: [SNSService],
    };
  }
}
