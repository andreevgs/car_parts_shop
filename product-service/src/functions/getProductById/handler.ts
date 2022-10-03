import {formatInternalServerErrorResponse, formatJSONResponse, formatNotFoundResponse} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import {APIGatewayProxyEvent} from "aws-lambda";
import AWS from "aws-sdk"

const ProductsTable = process.env.PRODUCTS_TABLE;
const StocksTable = process.env.STOCKS_TABLE;

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getProductById = async (event: APIGatewayProxyEvent) => {
  console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2))
  console.info("EVENT\n" + JSON.stringify(event, null, 2))

  const params = {
    TableName: ProductsTable,
    Key: {
      id: event.pathParameters.id,
    },
  };

  const stocksTableParams = (id: string) => {
    return {
      TableName: StocksTable,
      Key: {
        product_id: id,
      },
    }
  };

  try {
    const product = await dynamoDb.get(params).promise();
    if(!Object.keys(product).length){
      return formatNotFoundResponse({
        message: 'product not found',
      });
    }

    const stock = await dynamoDb.get(stocksTableParams(product.Item.id)).promise();
    const productStockJoined = {...product.Item, count: stock.Item.count};

    return formatJSONResponse({
      product: productStockJoined,
    });
  } catch (e) {
    return formatInternalServerErrorResponse({
      message: 'could not process request',
    });
  }
};

export const main = middyfy(getProductById);
