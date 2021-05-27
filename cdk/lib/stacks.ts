import { Construct, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, Compatibility, ContainerImage, TaskDefinition, AwsLogDriver } from '@aws-cdk/aws-ecs';
import { Certificate, CertificateValidation } from "@aws-cdk/aws-certificatemanager";
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import { PublicHostedZone, HostedZone } from '@aws-cdk/aws-route53';
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as path from 'path';
import { PolicyStatement } from '@aws-cdk/aws-iam';


export interface RsaMultihubStackProps extends StackProps {
  domainName: string
}

export class RsaMultihubStack extends Stack {
  constructor(scope: Construct, id: string, props?: RsaMultihubStackProps) {
    super(scope, id, props);

    let domainName = props?.domainName ?? 'amprsa.net'
    const vpc = new Vpc(this, 'vpc', { 
    });

    const cluster = new Cluster(this, 'rsa_multihub_cluster', {
      vpc
    });    

    const rsaMultihubTaskDefinition = new TaskDefinition(this, 'rsa_multihub_taskdef', {
      memoryMiB: '1024',
      cpu: '512',
      compatibility: Compatibility.EC2_AND_FARGATE,
    });

    const hostedZone = HostedZone.fromLookup(this, 'rsa_multihub_hosted_zone', {
      domainName
    });

    // const certificate = Certificate.fromCertificateArn(this, 'rsa_multihub_certificate', 'arn:aws:acm:us-east-2:873590723824:certificate/4ae9913e-a7aa-4d93-b861-f850bd135f47')
    const certificate = new Certificate(this, 'Certificate', {
      domainName,
      validation: CertificateValidation.fromDns(hostedZone)
    })

    rsaMultihubTaskDefinition.addContainer("default", {
      image: ContainerImage.fromAsset(path.join(__dirname, '..', '..'), {
        exclude: [
          'node_modules',
          '.git',
          'cdk'
        ]
      }),
      memoryLimitMiB: 1024,
      environment: {},
      logging: new AwsLogDriver({ streamPrefix: `/nova/amp-${id}` }),
    }).addPortMappings({ containerPort: 3000 });

    const rsaMultihubService = new ApplicationLoadBalancedFargateService(this, 'rsa_multihub_service', {
      assignPublicIp: true,
      serviceName: `${id}-service`,
      taskDefinition: rsaMultihubTaskDefinition,
      cluster,
      desiredCount: 1,
      protocol: ApplicationProtocol.HTTPS,
      domainName: `graphql.${domainName}`,
      domainZone: hostedZone,
      certificate,
      publicLoadBalancer: true,
      redirectHTTP: true
    });

    // rsaMultihubTaskDefinition.addToTaskRolePolicy(
    //   new PolicyStatement({
    //     actions: [
    //       "s3:DeleteObject",
    //       "s3:GetObject",
    //       "s3:ListBucket",
    //       "s3:PutObject"          
    //     ],
    //     resources: [
    //       "arn:aws:s3:::amp-rsa-multihub-logs"
    //     ]
    //   })
    // );

    rsaMultihubService.targetGroup.configureHealthCheck({
      path: "/check",
    });  
  }
}
