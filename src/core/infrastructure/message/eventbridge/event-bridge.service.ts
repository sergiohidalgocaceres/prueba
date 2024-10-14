import {
  EventBridgeClient,
  PutEventsCommand,
  PutEventsCommandInput,
} from '@aws-sdk/client-eventbridge';
import { Inject, Injectable } from '@nestjs/common';

import { IntegrationEvent } from '../integration-event-publisher';
import { EVENT_BRIDGE_OPTIONS } from './event-bridge.symbols';
import {
  EventBridgeConfig,
  EventBridgeConfigExtra,
  EventBridgeIntegrationEventPublisher,
} from './event-bridge.type';

@Injectable()
export class EventBridgeService
  implements EventBridgeIntegrationEventPublisher
{
  private readonly config: EventBridgeConfig;
  private readonly client: EventBridgeClient;

  constructor(@Inject(EVENT_BRIDGE_OPTIONS) options: EventBridgeConfig) {
    this.config = options;
    this.client = new EventBridgeClient({ region: this.config.region });
  }

  async publish(
    event: IntegrationEvent,
    extraConfig: EventBridgeConfigExtra,
  ): Promise<void> {
    const input: PutEventsCommandInput = {
      Entries: [
        {
          Detail: JSON.stringify(event.data),
          DetailType: extraConfig.detailType,
          Source: extraConfig.source,
          EventBusName: extraConfig.eventBusName,
        },
      ],
    };
    const command = new PutEventsCommand(input);
    await this.client.send(command);
  }
}
