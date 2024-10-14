import { IntegrationEvent } from '../integration-event-publisher';

export type EventBridgeConfig = {
  region: string;
};

export type EventBridgeConfigExtra = {
  source: string;
  detailType: string;
  eventBusName: string;
};

export type EventBridgeIntegrationEventPublisher = {
  publish(
    event: IntegrationEvent,
    config: EventBridgeConfigExtra,
  ): Promise<void>;
};
