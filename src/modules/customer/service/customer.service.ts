import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { StepFunctionIntegrationEventPublisher } from 'src/core/infrastructure/message/stepfuntion/stepfunction.type';

import { envs } from '../../../config/environment-vars';
import { EventBridgeService } from '../../../core/infrastructure/message/eventbridge/event-bridge.service';
import { EventBridgeIntegrationEventPublisher } from '../../../core/infrastructure/message/eventbridge/event-bridge.type';
import { IntegrationEventPublisher } from '../../../core/infrastructure/message/integration-event-publisher';
import { SESService } from '../../../core/infrastructure/message/ses/ses.service';
import { SESIntegrationEventPublisher } from '../../../core/infrastructure/message/ses/ses.type';
import { SNSService } from '../../../core/infrastructure/message/sns/sns.service';
import { SQSService } from '../../../core/infrastructure/message/sqs/sqs.service';
import { StepFunctionService } from '../../../core/infrastructure/message/stepfuntion/stepfunction.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import {
  CustomerResponseDto,
  toCustomerResponseDto,
} from '../dto/customer-response.dto';
import { ListCustomerDto } from '../dto/list-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerRepository } from '../repository/customer.repository';
import { CustomerActions } from './customer.actions';

@Injectable()
export class CustomerService {
  constructor(
    private readonly customerRepository: CustomerRepository,
    @Inject(SQSService)
    private readonly sqsService: IntegrationEventPublisher,
    @Inject(SNSService) private readonly snsService: IntegrationEventPublisher,
    @Inject(SESService)
    private readonly sesService: SESIntegrationEventPublisher,
    @Inject(StepFunctionService)
    private readonly stepFunctionService: StepFunctionIntegrationEventPublisher,
    @Inject(EventBridgeService)
    private readonly eventBridgeService: EventBridgeIntegrationEventPublisher,
  ) {}

  async createCustomer(createCustomerDto: CreateCustomerDto): Promise<void> {
    try {
      const customer = {
        ...createCustomerDto,
        createdAt: new Date(),
      };
      await this.customerRepository.create(customer);
      await this.sqsService.publish({
        data: { ...customer, action: CustomerActions.CREATE_CUSTOMER },
      });
      await this.sesService.publish(
        { data: customer },
        {
          toAddresses: envs.sesToAddress,
          source: envs.sesSource,
          subject: envs.sesSubject,
        },
      );
      await this.stepFunctionService.publish(
        { data: customer },
        { stateMachineArn: envs.stepFunctionArn },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateCustomer(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<void> {
    try {
      const customer = { ...updateCustomerDto, updatedAt: new Date() };
      await this.customerRepository.update(id, customer);
      await this.sqsService.publish({
        data: { id, ...customer, action: CustomerActions.UPDATE_CUSTOMER },
      });
      await this.eventBridgeService.publish(
        { data: { id, ...customer } },
        {
          detailType: envs.evtBridgeDetailType,
          source: envs.evtBridgeSource,
          eventBusName: envs.evtBridgeEventBusName,
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteCustomer(id: number): Promise<void> {
    try {
      await this.customerRepository.delete(id);
      await this.snsService.publish({
        data: { id, CustomerActions: CustomerActions.DELETE_CUSTOMER },
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listCustomers(
    listCustomerDto: ListCustomerDto,
  ): Promise<CustomerResponseDto[]> {
    try {
      const customers = await this.customerRepository.findAll(
        listCustomerDto.limit,
        listCustomerDto.offset,
      );

      return toCustomerResponseDto(customers) as CustomerResponseDto[];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCustomer(id: number): Promise<CustomerResponseDto> {
    try {
      const customer = await this.customerRepository.findOne(id);
      return toCustomerResponseDto(customer) as CustomerResponseDto;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
