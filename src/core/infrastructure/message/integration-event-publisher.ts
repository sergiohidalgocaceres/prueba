export class IntegrationEvent {
  readonly data: Record<string, any>;
}
export type IntegrationEventPublisher = {
  publish(event: IntegrationEvent): Promise<void>;
};
