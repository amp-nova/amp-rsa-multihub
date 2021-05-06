import { Construct, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, Compatibility, ContainerImage, TaskDefinition, AwsLogDriver } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import * as path from 'path';


export interface RsaMultihubStackProps extends StackProps {
}

export class RsaMultihubStack extends Stack {
  constructor(scope: Construct, id: string, props?: RsaMultihubStackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'vpc', {      
    });

    const cluster = new Cluster(this, 'rsa_multihub_cluster', {
      vpc: vpc
    });    

    const rsaMultihubTaskDefinition = new TaskDefinition(this, 'rsa_multihub_taskdef', {
      memoryMiB: '1024',
      cpu: '512',
      compatibility: Compatibility.EC2_AND_FARGATE,
    });

    rsaMultihubTaskDefinition.addContainer("default", {
      image: ContainerImage.fromAsset(path.join(__dirname, '..', '..'), {
        exclude: [
          'node_modules',
          '.git',
          'cdk'
        ]
      }),
      memoryLimitMiB: 1024,
      environment: {
      },
      logging: new AwsLogDriver({ streamPrefix: '/nova/amp-rsa-multihub' }),
    }).addPortMappings({containerPort: 80});

    const rsaMultihubService = new ApplicationLoadBalancedFargateService(this, 'log_processing_service', {
      taskDefinition: rsaMultihubTaskDefinition,
      cluster: cluster,
      desiredCount: 1
    });
  }
}
