import {describe, expect, test} from '@jest/globals';
import {main} from '../handler';
import {mockedContext} from "../../../mocks/context";

describe('product list', () => {
    test('has a correct format', async () => {
        const actualValue = await main({}, mockedContext);
        actualValue.body = JSON.parse(actualValue.body);
        expect(typeof actualValue.body.products).not.toBe(undefined);
        expect(Array.isArray(actualValue.body.products)).toBe(true);
    });
});
