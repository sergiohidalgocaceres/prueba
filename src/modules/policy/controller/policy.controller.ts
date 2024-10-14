import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { CreatePolicyDto } from '../dto/create-policy.dto';
import { IdPolicyDto } from '../dto/id-policy.dto';
import { PolicyResponseDto } from '../dto/policy-response.dto';
import { UpdatePolicyDto } from '../dto/update-policy.dto';
import { PolicyService } from '../service/policy.service';

@Controller('policies')
export class PolicyController {
  constructor(private readonly policyService: PolicyService) {}

  @Post()
  async createPolicy(@Body() createPolicyDto: CreatePolicyDto): Promise<void> {
    return this.policyService.createPolicy(createPolicyDto);
  }

  @Get()
  async listPolicies(): Promise<PolicyResponseDto[]> {
    return this.policyService.listPolicies();
  }

  @Get(':id')
  async getPolicy(
    @Param() idPolicyDto: IdPolicyDto,
  ): Promise<PolicyResponseDto> {
    return this.policyService.getPolicy(idPolicyDto.id);
  }

  @Put(':id')
  async updatePolicy(
    @Param() idPolicyDto: IdPolicyDto,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ): Promise<void> {
    return this.policyService.updatePolicy(idPolicyDto.id, updatePolicyDto);
  }

  @Delete(':id')
  async deletePolicy(@Param() idPolicyDto: IdPolicyDto): Promise<void> {
    return this.policyService.deletePolicy(idPolicyDto.id);
  }
}
