#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as stacks from '../lib/stacks';
import * as path from 'path';

const app = new cdk.App();
const arm_branch = app.node.tryGetContext('arm_branch') || 'master';
new stacks.RsaMultihubStack(app, arm_branch === 'dev' ? `rsa-multihub-dev` : `rsa-multihub`, {
    env: {
        region: 'us-east-2',
        account: '873590723824'
    },
    arm_branch
});
