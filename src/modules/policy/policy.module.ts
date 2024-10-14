import { Module } from '@nestjs/common';

import { PolicyController } from './controller/policy.controller';
import { PolicyRepository } from './repository/policy.repository';
import { PolicyService } from './service/policy.service';

@Module({
  controllers: [PolicyController],
  providers: [PolicyService, PolicyRepository],
})
export class PolicyModule {}
