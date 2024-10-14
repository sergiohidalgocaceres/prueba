import { IntegrationEvent } from '../integration-event-publisher';

export type StepFunctionConfig = {
  region: string;
};

export type StepFunctionConfigExtra = {
  stateMachineArn: string;
};

export type StepFunctionIntegrationEventPublisher = {
  publish(
    event: IntegrationEvent,
    config: StepFunctionConfigExtra,
  ): Promise<void>;
};
