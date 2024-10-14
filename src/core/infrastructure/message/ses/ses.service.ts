import {
  SendEmailCommand,
  SendEmailCommandInput,
  SESClient,
} from '@aws-sdk/client-ses';
import { Inject, Injectable } from '@nestjs/common';

import { IntegrationEvent } from '../integration-event-publisher';
import { SES_OPTIONS } from './ses.symbols';
import {
  SESConfig,
  SESConfigExtra,
  SESIntegrationEventPublisher,
} from './ses.type';

@Injectable()
export class SESService implements SESIntegrationEventPublisher {
  private readonly config: SESConfig;
  private readonly client: SESClient;

  constructor(@Inject(SES_OPTIONS) options: SESConfig) {
    this.config = {
      region: options.region,
    };
    this.client = new SESClient({ region: this.config.region });
  }

  async publish(
    event: IntegrationEvent,
    extraConfig: SESConfigExtra,
  ): Promise<void> {
    const input: SendEmailCommandInput = {
      Destination: {
        ToAddresses: extraConfig.toAddresses,
        CcAddresses: extraConfig.ccAddresses || [],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'utf-8',
            Data: JSON.stringify(event.data),
          },
          Text: {
            Charset: 'utf-8',
            Data: JSON.stringify(event.data),
          },
        },
        Subject: {
          Charset: 'utf-8',
          Data: extraConfig.subject,
        },
      },
      Source: extraConfig.source,
      ReplyToAddresses: extraConfig.replyAddresses || [],
    };
    const command = new SendEmailCommand(input);
    await this.client.send(command);
  }
}
