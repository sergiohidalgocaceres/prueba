import { DynamicModule, Global, Module } from '@nestjs/common';

import { SESService } from './ses.service';
import { SES_OPTIONS } from './ses.symbols';
import { SESConfig } from './ses.type';

@Global()
@Module({})
export class SESModule {
  static forRoot(options: SESConfig): DynamicModule {
    return {
      module: SESModule,
      providers: [
        {
          provide: SES_OPTIONS,
          useValue: options,
        },
        SESService,
      ],
      exports: [SESService],
    };
  }
}
