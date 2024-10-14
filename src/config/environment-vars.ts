import 'dotenv/config';

import * as joi from 'joi';

type EnvironmentVars = {
  PORT: number;
  AWS_REGION: string;
  SQS_DELAY: number;
  SQS_URL: string;
  SNS_TOPIC_ARN: string;
  SES_SOURCE: string;
  SES_TO_ADDRESS: string;
  SES_CC_ADDRESS: string;
  SES_REPLY_ADDRESS: string;
  SES_SUBJECT: string;
  EVT_BRIDGE_SOURCE: string;
  EVT_BRIDGE_DETAIL_TYPE: string;
  EVT_BRIDGE_EVENT_BUS_NAME: string;
  STEP_FUNCTION_ARN: string;
  MYSQL_HOST: string;
  MYSQL_PORT: number;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  MYSQL_DATABASE: string;
  SQLSERVER_HOST: string;
  SQLSERVER_USER: string;
  SQLSERVER_PASSWORD: string;
  SQLSERVER_DATABASE: string;
  ORACLE_USER: string;
  ORACLE_PASSWORD: string;
  ORACLE_CONNECT_STRING: string;
};

type ValidationEnvironmentVars = {
  error: joi.ValidationError | undefined;
  value: EnvironmentVars;
};

export type ReturnEnvironmentVars = {
  awsRegion: string;
  port: number;
  sqsDelay: number;
  sqsUrl: string;
  snsTopicArn: string;
  sesSource: string;
  sesToAddress: string[];
  sesCCAddress: string[];
  sesReplyAddress: string[];
  sesSubject: string;
  evtBridgeSource: string;
  evtBridgeDetailType: string;
  evtBridgeEventBusName: string;
  stepFunctionArn: string;
  mysqlHost: string;
  mysqlPort: number;
  mysqlUser: string;
  mysqlPassword: string;
  mysqlDatabase: string;
  sqlServerHost: string;
  sqlServerUser: string;
  sqlServerPassword: string;
  sqlServerDatabase: string;
  oracleUser: string;
  oraclePassword: string;
  oracleConnectString: string;
};

function validateEnvironmentVars(
  vars: Record<string, any>,
): ValidationEnvironmentVars {
  const envsSchema = joi
    .object({
      PORT: joi.number().required(),
      AWS_REGION: joi.string().required(),
      SQS_DELAY: joi.number().required(),
      SQS_URL: joi.string().required(),
      SNS_TOPIC_ARN: joi.string().required(),
      SES_SOURCE: joi.string().required(),
      SES_TO_ADDRESS: joi.string().required(),
      SES_CC_ADDRESS: joi.string().required(),
      SES_REPLY_ADDRESS: joi.string().required(),
      SES_SUBJECT: joi.string().required(),
      EVT_BRIDGE_SOURCE: joi.string().required(),
      EVT_BRIDGE_DETAIL_TYPE: joi.string().required(),
      EVT_BRIDGE_EVENT_BUS_NAME: joi.string().required(),
      STEP_FUNCTION_ARN: joi.string().required(),
      MYSQL_HOST: joi.string().required(),
      MYSQL_PORT: joi.number().required(),
      MYSQL_USER: joi.string().required(),
      MYSQL_PASSWORD: joi.string().required(),
      MYSQL_DATABASE: joi.string().required(),
      SQLSERVER_HOST: joi.string().required(),
      SQLSERVER_USER: joi.string().required(),
      SQLSERVER_PASSWORD: joi.string().required(),
      SQLSERVER_DATABASE: joi.string().required(),
      ORACLE_USER: joi.string().required(),
      ORACLE_PASSWORD: joi.string().required(),
      ORACLE_CONNECT_STRING: joi.string().required(),
    })
    .unknown(true);

  const { error, value } = envsSchema.validate(process.env);
  return { error, value };
}

function loadEnvironmentVars(): ReturnEnvironmentVars {
  const result: ValidationEnvironmentVars = validateEnvironmentVars(
    process.env,
  );
  if (result.error) {
    throw new Error(
      `Config validation environmente vars error: ${result.error.message}`,
    );
  }

  const value = result.value;
  return {
    awsRegion: value.AWS_REGION,
    port: value.PORT,
    sqsDelay: value.SQS_DELAY,
    sqsUrl: value.SQS_URL,
    snsTopicArn: value.SNS_TOPIC_ARN,
    sesSource: value.SES_SOURCE,
    sesToAddress: value.SES_TO_ADDRESS.split(','),
    sesCCAddress: value.SES_CC_ADDRESS.split(','),
    sesReplyAddress: value.SES_REPLY_ADDRESS.split(','),
    sesSubject: value.SES_SUBJECT,
    evtBridgeSource: value.EVT_BRIDGE_SOURCE,
    evtBridgeDetailType: value.EVT_BRIDGE_DETAIL_TYPE,
    evtBridgeEventBusName: value.EVT_BRIDGE_EVENT_BUS_NAME,
    stepFunctionArn: value.STEP_FUNCTION_ARN,
    mysqlHost: value.MYSQL_HOST,
    mysqlPort: value.MYSQL_PORT,
    mysqlUser: value.MYSQL_USER,
    mysqlPassword: value.MYSQL_PASSWORD,
    mysqlDatabase: value.MYSQL_DATABASE,
    sqlServerHost: value.SQLSERVER_HOST,
    sqlServerUser: value.SQLSERVER_USER,
    sqlServerPassword: value.SQLSERVER_PASSWORD,
    sqlServerDatabase: value.SQLSERVER_DATABASE,
    oracleUser: value.ORACLE_USER,
    oraclePassword: value.ORACLE_PASSWORD,
    oracleConnectString: value.ORACLE_CONNECT_STRING,
  };
}

export const envs = loadEnvironmentVars();
