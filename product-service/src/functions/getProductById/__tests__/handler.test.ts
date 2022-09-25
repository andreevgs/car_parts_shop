import {describe, expect, test} from '@jest/globals';
import {main} from '../handler';
import {mockedContext} from "../../../mocks/context";

describe('product', () => {
    test('has a correct format', async () => {
        const mEvent = { pathParameters: {id: '1'}};
        const actualValue = await main(mEvent, mockedContext);
        console.log(actualValue);
        actualValue.body = JSON.parse(actualValue.body);
        expect(typeof actualValue.body.product).toBe('object');
        expect(Object.keys(actualValue.body.product)).not.toBe(0);
    });
    test('can be not found', async () => {
        const mEvent = { pathParameters: {id: '0'}};
        const actualValue = await main(mEvent, mockedContext);
        expect(actualValue.statusCode).toBe(404);
        expect(actualValue.body).toBe(JSON.stringify({message: 'product not found'}));
    });
});
