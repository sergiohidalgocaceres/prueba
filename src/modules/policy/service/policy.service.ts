import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { CreatePolicyDto } from '../dto/create-policy.dto';
import {
  PolicyResponseDto,
  toPolicyResponseDto,
} from '../dto/policy-response.dto';
import { UpdatePolicyDto } from '../dto/update-policy.dto';
import { PolicyRepository } from '../repository/policy.repository';

@Injectable()
export class PolicyService {
  constructor(private readonly policyRepository: PolicyRepository) {}

  async createPolicy(createPolicyDto: CreatePolicyDto): Promise<void> {
    try {
      const policy = {
        ...createPolicyDto,
        id: uuidv4(),
      };
      await this.policyRepository.create(policy);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listPolicies(): Promise<PolicyResponseDto[]> {
    try {
      const policies = await this.policyRepository.findAll();
      return toPolicyResponseDto(policies) as PolicyResponseDto[];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getPolicy(id: string): Promise<PolicyResponseDto> {
    try {
      const policy = await this.policyRepository.findOne(id);
      return toPolicyResponseDto(policy) as PolicyResponseDto;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updatePolicy(
    id: string,
    updatePolicyDto: UpdatePolicyDto,
  ): Promise<void> {
    try {
      await this.policyRepository.update(id, updatePolicyDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deletePolicy(id: string): Promise<void> {
    try {
      await this.policyRepository.delete(id);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
