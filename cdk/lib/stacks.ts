import { Construct, Stack, StackProps, CfnOutput } from '@aws-cdk/core';
import { Vpc } from '@aws-cdk/aws-ec2';
import { Cluster, Compatibility, ContainerImage, TaskDefinition, AwsLogDriver } from '@aws-cdk/aws-ecs';
import { DockerImageAsset } from '@aws-cdk/aws-ecr-assets';
import { Certificate, CertificateValidation } from "@aws-cdk/aws-certificatemanager";
import { ApplicationLoadBalancedFargateService } from '@aws-cdk/aws-ecs-patterns';
import { PublicHostedZone, HostedZone } from '@aws-cdk/aws-route53';
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import * as path from 'path';
import { PolicyStatement } from '@aws-cdk/aws-iam';


export interface RsaMultihubStackProps extends StackProps {
  branch: string
}

export class RsaMultihubStack extends Stack {
  constructor(scope: Construct, id: string, props?: RsaMultihubStackProps) {
    super(scope, id, props);

    let arm_branch = props?.branch ?? "master"
    let domainName = arm_branch === 'master' ? 'amprsa.net' : 'amprsa-dev.net'
    let hostName = `graphql.${domainName}`

    const vpc = new Vpc(this, 'vpc', {});
    const cluster = new Cluster(this, `${id}_cluster`, { vpc });    

    const rsaMultihubTaskDefinition = new TaskDefinition(this, `${id}_taskdef`, {
      memoryMiB: '1024',
      cpu: '512',
      compatibility: Compatibility.EC2_AND_FARGATE,
    });

    const hostedZone = HostedZone.fromLookup(this, `${id}_hosted_zone`, {
      domainName
    });

    const certificate = new Certificate(this, `${id}_certificate`, {
      domainName: hostName,
      validation: CertificateValidation.fromDns(hostedZone)
    })

    rsaMultihubTaskDefinition.addContainer("default", {
      image: ContainerImage.fromDockerImageAsset(new DockerImageAsset(this, `${id}_docker_image_asset`, {
        directory: '..',
        buildArgs: { 
          arm_branch,
          arm_build_date: new Date().toISOString()
        },
        exclude: [
          'node_modules',
          '.git',
          'cdk'
        ]
      })),

      //  image: ContainerImage.fromAsset(path.join(__dirname, '..', '..'), {
      //    exclude: [
      //      'node_modules',
      //      '.git',
      //      'cdk'
      //    ]
      //  }),

      // image: ContainerImage.fromEcrRepository(Repository.fromRepositoryName(this, "default", `amp-rsa-multihub/${mode}`)),
      memoryLimitMiB: 1024,
      environment: {},
      logging: new AwsLogDriver({ streamPrefix: `/nova/amp-${id}` }),
    }).addPortMappings({ containerPort: 3000 });

    const rsaMultihubService = new ApplicationLoadBalancedFargateService(this, `${id}_service`, {
      assignPublicIp: true,
      serviceName: `${id}-service`,
      taskDefinition: rsaMultihubTaskDefinition,
      cluster,
      desiredCount: 1,
      protocol: ApplicationProtocol.HTTPS,
      domainName: hostName,
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
