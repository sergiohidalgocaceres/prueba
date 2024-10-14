import { IntegrationEvent } from '../integration-event-publisher';

export type SESConfig = {
  region: string;
};

export type SESConfigExtra = {
  toAddresses: string[];
  ccAddresses?: string[];
  replyAddresses?: string[];
  source: string;
  subject: string;
};

export type SESIntegrationEventPublisher = {
  publish(event: IntegrationEvent, config: SESConfigExtra): Promise<void>;
};
