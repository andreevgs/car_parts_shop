import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-auto-swagger'],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: [
            'dynamodb:DescribeTable',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:GetItem',
            'dynamodb:PutItem'
        ],
        Resource: [
          { "Fn::GetAtt": ["ProductsTable", "Arn" ] },
          { "Fn::GetAtt": ["StocksTable", "Arn" ] }
        ],
      },
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: { Ref: 'createProductTopic' }
      }
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE: '${self:custom.productsTable}',
      STOCKS_TABLE: '${self:custom.stocksTable}',
      CREATE_PRODUCT_TOPIC_ARN: { Ref: 'createProductTopic' },
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct, catalogBatchProcess },
  resources: {
    Resources: {
      ProductsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [{
            AttributeName: 'id',
            AttributeType: 'S'
          }],
          KeySchema: [{
            AttributeName: 'id',
            KeyType: 'HASH'
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
          TableName: '${self:custom.productsTable}'
        }
      },
      StocksTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [{
            AttributeName: 'product_id',
            AttributeType: 'S'
          }],
          KeySchema: [{
            AttributeName: 'product_id',
            KeyType: 'HASH'
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
          TableName: '${self:custom.stocksTable}'
        }
      },
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: "catalogItemsQueue"
        }
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic',
          Subscription: [
            { Protocol: 'email', Endpoint: '${env:EMAIL}' }
          ],
        }
      },
      expensiveProductsImportSub: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          TopicArn: { Ref: 'createProductTopic' },
          Endpoint: '${env:EXPENSIVE_EMAIL}',
          FilterPolicy: { price: [{ "numeric": [">=", 100] }] },
          Protocol: 'email',
        }
      },
    }
  },
  package: { individually: true },
  custom: {
    productsTable: 'products',
    stocksTable: 'stocks',
    autoswagger: {
      apiType: 'http',
      basePath: '/dev'
    },
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
