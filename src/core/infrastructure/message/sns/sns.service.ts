import {
  PublishCommand,
  PublishCommandInput,
  SNSClient,
} from '@aws-sdk/client-sns';
import { Inject, Injectable } from '@nestjs/common';

import {
  IntegrationEvent,
  IntegrationEventPublisher,
} from '../integration-event-publisher';
import { SNS_OPTIONS } from './sns.symbols';
import { SNSConfig } from './sns.type';

@Injectable()
export class SNSService implements IntegrationEventPublisher {
  private readonly config: SNSConfig;
  private readonly client: SNSClient;

  constructor(@Inject(SNS_OPTIONS) options: SNSConfig) {
    this.config = {
      topicArn: options.topicArn,
      region: options.region,
    };
    this.client = new SNSClient({ region: this.config.region });
  }

  async publish(event: IntegrationEvent): Promise<void> {
    const input: PublishCommandInput = {
      TopicArn: this.config.topicArn,
      Message: JSON.stringify(event.data),
    };

    const command = new PublishCommand(input);
    await this.client.send(command);
  }
}
