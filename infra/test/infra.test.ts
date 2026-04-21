import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { LeadsStack } from '../lib/leads-stack';

test('Leads Stack creates DynamoDB table, Lambda, and API Gateway', () => {
  const app = new cdk.App();
  const stack = new LeadsStack(app, 'TestLeadsStack');
  const template = Template.fromStack(stack);

  template.hasResourceProperties('AWS::DynamoDB::Table', {
    TableName: 'dexavision-Leads',
  });

  template.hasResourceProperties('AWS::Lambda::Function', {
    FunctionName: 'dexavision-collect-lead',
    Architectures: ['arm64'],
    Runtime: 'nodejs20.x',
    MemorySize: 256,
    Timeout: 10,
  });
  template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
});
