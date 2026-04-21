#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { LeadsStack } from '../lib/leads-stack';

const app = new cdk.App();
new LeadsStack(app, 'DexavisionLeadsStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
});
