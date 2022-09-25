import {formatJSONResponse} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import products from '../../mocks/products.json';

const getProducts = async () => {
  return formatJSONResponse({
    products,
  });
};

export const main = middyfy(getProducts);
