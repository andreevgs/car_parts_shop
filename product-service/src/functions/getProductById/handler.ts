import {formatJSONResponse, formatNotFoundResponse} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import {APIGatewayProxyEvent} from "aws-lambda";
import products from '../../mocks/products.json';

const getProductById = async (event: APIGatewayProxyEvent) => {
  const product = products.find(product => product.id === event.pathParameters.id);
  if(!product) {
    return formatNotFoundResponse({
      message: 'product not found'
    });
  }
  return formatJSONResponse({
    product,
  });
};

export const main = middyfy(getProductById);
