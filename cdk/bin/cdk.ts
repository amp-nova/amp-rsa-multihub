#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as stacks from '../lib/stacks';
import * as path from 'path';

const app = new cdk.App();

new stacks.RsaMultihubStack(app, 'rsa-multihub');
