import {middyfy} from '@libs/lambda';
import {APIGatewayProxyEvent} from "aws-lambda";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {formatBadRequestResponse, formatInternalServerErrorResponse, formatJSONResponse} from "@libs/api-gateway";
import {BUCKET_NAME, REGION} from "../../configs/config";

const isCsvFile = (fileName: string) => fileName.lastIndexOf('.csv') === (fileName.length - '.csv'.length);

const importProductsFile = async (event: APIGatewayProxyEvent) => {
    try {
        const { name } = event.queryStringParameters;
        if (typeof name !== 'string' || name === '' || !isCsvFile(name)) {
            return formatBadRequestResponse({
                message: 'Provided file name is unacceptable'
            });
        }

        const s3Client = new S3Client({ region: REGION });

        const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: `uploaded/${name}` });
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600, });
        return formatJSONResponse({url: signedUrl});
    } catch (e) {
        console.log('Internal server error', e);
        return formatInternalServerErrorResponse({
            message: 'Internal Server Error'
        });
    }
};

export const main = middyfy(importProductsFile);
