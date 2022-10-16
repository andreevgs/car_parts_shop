import {middyfy} from '@libs/lambda';
import csv from 'csv-parser';
import {
    CopyObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
    GetObjectCommandOutput,
    S3Client
} from "@aws-sdk/client-s3";
import {S3Handler} from "aws-lambda";
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import {BUCKET_NAME, REGION} from "../../configs/config";

const getFileName = (key: string) => {
    const splittedKey = key.split('/');
    const fileNameWithExtension = splittedKey[splittedKey.length - 1];
    if (fileNameWithExtension.indexOf('.csv') === -1) return undefined;
    return fileNameWithExtension;
};

const sendDataToQueue = (sqsClient: SQSClient, data: any) => {
    if (typeof data !== 'object') return;
    if (typeof data.title !== 'string') return;
    if (data.description !== undefined && typeof data.description !== 'string') return false;
    const price = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
    if (typeof price !== 'number' || price <= 0) return;
    const count = typeof data.count === 'string' ? parseInt(data.count) : data.count;
    if (typeof count !== 'number' || count <= 0) return;

    sqsClient.send(new SendMessageCommand({
        QueueUrl: process.env.SQS_URL,
        MessageBody: JSON.stringify({
            price,
            count,
            title: data.title,
            description: data.description,
        }),
    }));

};

const processProductsData = (getObjectResponse: GetObjectCommandOutput): Promise<unknown[]> => {
    const sqsClient = new SQSClient({ region: REGION });

    return new Promise((resolve) => {
        const results = [];
        getObjectResponse.Body
            ?.pipe(csv({ separator: '\t' }))
            ?.on('data', (data) => { sendDataToQueue(sqsClient, data); })
            ?.on('end', () => { resolve(results) });
    });
}

export const importFileParser: S3Handler = async (event) => {
    try {
        const createdObjectKey = event.Records?.[0]?.s3?.object?.key;
        if (!createdObjectKey) return;

        const s3Client = new S3Client({region: REGION});

        const getObjectResponse = await s3Client.send(new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: createdObjectKey,
        }));

        await processProductsData(getObjectResponse);

        const fileName = getFileName(createdObjectKey);
        if (!fileName) return;

        await s3Client.send(new CopyObjectCommand({
            Bucket: BUCKET_NAME,
            Key: `parsed/${fileName}`,
            CopySource: `${BUCKET_NAME}/${createdObjectKey}`,
        }));

        await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: createdObjectKey,
        }));
    } catch (e) {
        console.log('Internal server error', e);
    }
};

export const main = middyfy(importFileParser);
