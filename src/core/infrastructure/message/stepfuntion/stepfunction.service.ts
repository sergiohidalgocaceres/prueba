import {
  SFNClient,
  StartExecutionCommand,
  StartExecutionCommandInput,
} from '@aws-sdk/client-sfn';
import { Inject, Injectable } from '@nestjs/common';

import { IntegrationEvent } from '../integration-event-publisher';
import { STEPFUNCTION_OPTIONS } from './stepfunction.symbols';
import {
  StepFunctionConfig,
  StepFunctionConfigExtra,
  StepFunctionIntegrationEventPublisher,
} from './stepfunction.type';

@Injectable()
export class StepFunctionService
  implements StepFunctionIntegrationEventPublisher
{
  private readonly config: StepFunctionConfig;
  private readonly client: SFNClient;

  constructor(@Inject(STEPFUNCTION_OPTIONS) options: StepFunctionConfig) {
    this.config = options;
    this.client = new SFNClient({ region: this.config.region });
  }

  async publish(
    event: IntegrationEvent,
    extraConfig: StepFunctionConfigExtra,
  ): Promise<void> {
    const input: StartExecutionCommandInput = {
      stateMachineArn: extraConfig.stateMachineArn,
      input: JSON.stringify(event.data),
    };
    const command = new StartExecutionCommand(input);
    await this.client.send(command);
  }
}
