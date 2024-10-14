import { Module } from '@nestjs/common';

import { envs } from './config/environment-vars';
import { DynamoDBModule } from './core/infrastructure/database/dynamodb/dynamodb.module';
import { MySQLModule } from './core/infrastructure/database/mysql/mysql.module';
import { EventBridgeModule } from './core/infrastructure/message/eventbridge/event-bridge.module';
import { SESModule } from './core/infrastructure/message/ses/ses.module';
import { SNSModule } from './core/infrastructure/message/sns/sns.module';
import { SQSModule } from './core/infrastructure/message/sqs/sqs.module';
import { StepFunctionModule } from './core/infrastructure/message/stepfuntion/stepfunction.module';
import { CustomerModule } from './modules/customer/customer.module';
import { PolicyModule } from './modules/policy/policy.module';

@Module({
  imports: [
    CustomerModule,
    PolicyModule,
    MySQLModule.forRoot({
      host: envs.mysqlHost,
      port: envs.mysqlPort,
      user: envs.mysqlUser,
      password: envs.mysqlPassword,
      database: envs.mysqlDatabase,
    }),
    SQSModule.forRoot({
      delay: envs.sqsDelay,
      url: envs.sqsUrl,
      region: envs.awsRegion,
    }),
    SNSModule.forRoot({
      topicArn: envs.snsTopicArn,
      region: envs.awsRegion,
    }),
    SESModule.forRoot({
      region: envs.awsRegion,
    }),
    StepFunctionModule.forRoot({
      region: envs.awsRegion,
    }),
    EventBridgeModule.forRoot({
      region: envs.awsRegion,
    }),
    DynamoDBModule.forRoot({
      region: envs.awsRegion,
    }),
  ],
})
export class AppModule {}
