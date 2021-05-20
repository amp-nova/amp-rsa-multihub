import { Construct, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, Compatibility, ContainerImage, TaskDefinition, AwsLogDriver } from '@aws-cdk/aws-ecs';
import { Certificate } from "@aws-cdk/aws-certificatemanager";
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import { PublicHostedZone, HostedZone } from '@aws-cdk/aws-route53';
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as path from 'path';
import { PolicyStatement } from '@aws-cdk/aws-iam';


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

    // const hostedZone = new PublicHostedZone(this, 'rsa_multihub_hosted_zone', {
    //   zoneName: "ampdemo.net"
    // })

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'rsa_multihub_hosted_zone', {
      zoneName: 'ampdemo.net',
      hostedZoneId: 'Z0317391113W55YD54Z33',
    });

    const certificate = Certificate.fromCertificateArn(this, 'rsa_multihub_certificate', 'arn:aws:acm:us-east-2:873590723824:certificate/3474c976-9ebf-4a3e-a9d8-0a538b0db044')

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
    }).addPortMappings({ containerPort: 3000 });

    const rsaMultihubService = new ApplicationLoadBalancedFargateService(this, 'rsa_multihub_service', {
      assignPublicIp: true,
      serviceName: "rsa-multihub-service",
      taskDefinition: rsaMultihubTaskDefinition,
      cluster: cluster,
      desiredCount: 1,
      protocol: ApplicationProtocol.HTTPS,
      domainName: "graphql.ampdemo.net",
      domainZone: hostedZone,
      certificate,
      publicLoadBalancer: true,
      redirectHTTP: true
    });

    rsaMultihubTaskDefinition.addToTaskRolePolicy(
      new PolicyStatement({
        actions: [
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:PutObject"          
        ],
        resources: [
          "arn:aws:s3:::amp-rsa-multihub-logs"
        ]
      })
    );

    rsaMultihubService.targetGroup.configureHealthCheck({
      path: "/check",
    });  
  }
}
