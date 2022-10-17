const expectedPresignedUrl = 'testURL';

jest.mock('@aws-sdk/s3-request-presigner', () => ({ getSignedUrl: jest.fn().mockReturnValue(expectedPresignedUrl) }));
jest.mock('@aws-sdk/client-s3');

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {describe, expect, test} from '@jest/globals';
import {main} from '../handler';
import {mockedContext} from "../../../mocks/context";

describe('importProductsFile', () => {

    test('empty query string parameters', async () => {
        const mEvent = { queryStringParameters: {} };
        const result = await main(mEvent, mockedContext);
        result.body = JSON.parse(result.body);
        expect(result.body).toEqual({ message: "Provided file name is unacceptable"});
        expect(result.statusCode).toEqual(400);
    });

    test('name query parameter is empty', async () => {
        const mEvent = { queryStringParameters: {} };
        const result = await main(mEvent, mockedContext);
        result.body = JSON.parse(result.body);
        expect(result.body).toEqual({ message: "Provided file name is unacceptable"});
        expect(result.statusCode).toEqual(400);
    });

    test('name query parameter is contains not csv file', async () => {
        const mEvent = { queryStringParameters: {} };
        const result = await main(mEvent, mockedContext);
        result.body = JSON.parse(result.body);
        expect(result.body).toEqual({ message: "Provided file name is unacceptable"});
        expect(result.statusCode).toEqual(400);
    });

    test('should return signedUrl', async () => {
        const mEvent = { queryStringParameters: { name: 'test.csv'} };
        const result = await main(mEvent, mockedContext);
        result.body = JSON.parse(result.body);
        expect(result.body).toEqual({url: expectedPresignedUrl});
        expect(S3Client).toBeCalledTimes(1);
        expect(PutObjectCommand).toBeCalledTimes(1);
        expect(getSignedUrl).toBeCalledTimes(1);
    });
});