import { DynamicModule, Global, Module } from '@nestjs/common';

import { EventBridgeService } from './event-bridge.service';
import { EVENT_BRIDGE_OPTIONS } from './event-bridge.symbols';
import { EventBridgeConfig } from './event-bridge.type';

@Global()
@Module({})
export class EventBridgeModule {
  static forRoot(options: EventBridgeConfig): DynamicModule {
    return {
      module: EventBridgeModule,
      providers: [
        {
          provide: EVENT_BRIDGE_OPTIONS,
          useValue: options,
        },
        EventBridgeService,
      ],
      exports: [EventBridgeService],
    };
  }
}
