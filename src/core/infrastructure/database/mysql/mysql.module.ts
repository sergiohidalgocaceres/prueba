import { DynamicModule, Global, Module } from '@nestjs/common';

import { MySQLService } from './mysql.service';
import { MYSQL_OPTIONS } from './mysql.symbols';
import { MySQLConfig } from './mysql.type';

@Global()
@Module({})
export class MySQLModule {
  static forRoot(options: MySQLConfig): DynamicModule {
    return {
      module: MySQLModule,
      providers: [
        {
          provide: MYSQL_OPTIONS,
          useValue: options,
        },
        MySQLService,
      ],
      exports: [MySQLService],
    };
  }
}
