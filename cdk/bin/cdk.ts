#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as stacks from '../lib/stacks';
import * as path from 'path';

const app = new cdk.App();

new stacks.RsaMultihubStack(app, 'rsa-multihub-dev', {
    env: {
        region: 'us-east-2',
        account: '873590723824'
    },
    domainName: 'amprsa-dev.net'
});
