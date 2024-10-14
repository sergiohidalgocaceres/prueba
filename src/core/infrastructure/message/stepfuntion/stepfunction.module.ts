import { DynamicModule, Global, Module } from '@nestjs/common';

import { StepFunctionService } from './stepfunction.service';
import { STEPFUNCTION_OPTIONS } from './stepfunction.symbols';
import { StepFunctionConfig } from './stepfunction.type';

@Global()
@Module({})
export class StepFunctionModule {
  static forRoot(options: StepFunctionConfig): DynamicModule {
    return {
      module: StepFunctionModule,
      providers: [
        {
          provide: STEPFUNCTION_OPTIONS,
          useValue: options,
        },
        StepFunctionService,
      ],
      exports: [StepFunctionService],
    };
  }
}
