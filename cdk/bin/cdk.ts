#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as stacks from '../lib/stacks';
import * as path from 'path';

const app = new cdk.App();
const mode = app.node.tryGetContext('mode') || 'prod';
new stacks.RsaMultihubStack(app, mode === 'dev' ? `rsa-multihub-dev` : `rsa-multihub`, {
    env: {
        region: 'us-east-2',
        account: '873590723824'
    },
    domainName: mode === 'dev' ? 'amprsa-dev.net' : 'amprsa.net',
    mode
});
