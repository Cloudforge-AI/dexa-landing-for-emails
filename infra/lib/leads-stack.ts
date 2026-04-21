import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

export class LeadsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table
    const leadsTable = new dynamodb.Table(this, 'LeadsTable', {
      tableName: 'dexavision-Leads',
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Lambda Function
    const collectLeadFn = new NodejsFunction(this, 'CollectLeadFunction', {
      functionName: 'dexavision-collect-lead',
      entry: path.join(__dirname, '..', 'lambda', 'collect-lead', 'index.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 256,
      timeout: cdk.Duration.seconds(10),
      environment: {
        TABLE_NAME: leadsTable.tableName,
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
      bundling: {
        externalModules: ['@aws-sdk/*'],
        minify: true,
        sourceMap: true,
        target: 'es2020',
      },
    });

    leadsTable.grantWriteData(collectLeadFn);

    // API Gateway
    const api = new apigateway.RestApi(this, 'LeadsApi', {
      restApiName: 'dexavision-leads-api',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowHeaders: ['Content-Type'],
        allowMethods: ['POST', 'OPTIONS'],
      },
      deployOptions: {
        throttlingRateLimit: 10,
        throttlingBurstLimit: 20,
      },
    });

    const leadsResource = api.root.addResource('leads');
    leadsResource.addMethod('POST', new apigateway.LambdaIntegration(collectLeadFn));

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'Leads API endpoint URL',
    });
  }
}
