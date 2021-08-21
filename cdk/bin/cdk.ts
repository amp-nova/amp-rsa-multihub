#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as stacks from '../lib/stacks';
import * as path from 'path';
import console = require('console');

const app = new cdk.App();
// const arm_branch = app.node.tryGetContext('arm_branch') || 'master';

const { exec } = require("child_process");

exec("git rev-parse --abbrev-ref HEAD", (error: { message: any; }, stdout: any, stderr: any) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }

    let arm_branch = stdout.trim()
    new stacks.RsaMultihubStack(app, arm_branch === 'dev' ? `rsa-multihub-dev` : `rsa-multihub`, {
        env: {
            region: 'us-east-2',
            account: '873590723824'
        },
        arm_branch
    });
});