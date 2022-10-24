import type {AWS} from '@serverless/typescript';

import importFileParser from '@functions/importFileParser';
import importProductsFile from "@functions/importProductsFile";

const serverlessConfiguration: AWS = {
    service: 'import-service',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild'],
    useDotenv: true,
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        region: 'eu-west-1',
        iam: {
            role: {
                statements: [
                    {
                        Effect: 'Allow',
                        Action: ['s3:*'],
                        Resource: "arn:aws:s3:::car-parts-import/*"
                    },
                    {
                        Effect: 'Allow',
                        Action: ['sqs:*'],
                        Resource: '${env:SQS_ARN}'
                    }
                ],
            },
        },
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
            SQS_URL: '${env:SQS_URL}',
        },
        httpApi: {
            cors: true,
            shouldStartNameWithService: true,
            authorizers: {
                basicImportAuthorizer: {
                    payloadVersion: '2.0',
                    functionArn: '${env:BASIC_AUTHORIZER_ARN}',
                    type: 'request',
                    identitySource: ['$request.header.Authorization'],
                    resultTtlInSeconds: 0,
                }
            }
        },
    },
    // import the function via paths
    functions: {
        importProductsFile: {
            handler: importProductsFile.handler,
            events: [
                {
                    httpApi: {
                        method: 'get',
                        path: '/import',
                        authorizer: 'basicImportAuthorizer'
                    },
                },
            ],
        },
        importFileParser
    },
    package: {individually: true},
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;
