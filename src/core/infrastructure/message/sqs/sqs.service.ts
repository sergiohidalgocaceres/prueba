import {
  SendMessageCommand,
  SendMessageCommandInput,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Inject, Injectable } from '@nestjs/common';

import {
  IntegrationEvent,
  IntegrationEventPublisher,
} from '../integration-event-publisher';
import { SQS_OPTIONS } from './sqs.symbols';
import { SQSConfig } from './sqs.type';

@Injectable()
export class SQSService implements IntegrationEventPublisher {
  private readonly config: SQSConfig;
  private readonly client: SQSClient;

  constructor(@Inject(SQS_OPTIONS) options: SQSConfig) {
    this.config = {
      delay: options.delay,
      url: options.url,
      region: options.region,
    };
    this.client = new SQSClient({ region: this.config.region });
  }

  async publish(event: IntegrationEvent): Promise<void> {
    const input: SendMessageCommandInput = {
      DelaySeconds: this.config.delay,
      QueueUrl: this.config.url,
      MessageBody: JSON.stringify(event.data),
    };
    const command = new SendMessageCommand(input);
    this.client.send(command);
  }
}
