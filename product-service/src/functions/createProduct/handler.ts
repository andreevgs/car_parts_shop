import {formatInternalServerErrorResponse, formatJSONResponse, ValidatedAPIGatewayProxyEvent} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import AWS from "aws-sdk";
import schema from "@functions/createProduct/schema";
import { v4 as uuidv4 } from 'uuid';

const ProductsTable = process.env.PRODUCTS_TABLE;
const StocksTable = process.env.STOCKS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const createProduct = async (event: ValidatedAPIGatewayProxyEvent<typeof schema>) => {
    console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2))
    console.info("EVENT\n" + JSON.stringify(event, null, 2))

    const data = event.body;
    const productId = uuidv4();

    try {
        await dynamoDb.transactWrite(
            {
                TransactItems: [
                    {
                        Put: {
                            Item: {
                                id: productId,
                                price: data.price,
                                title: data.title,
                                description: data.description
                            },
                            TableName: ProductsTable,
                            ConditionExpression: 'attribute_not_exists(id)'
                        }
                    },
                    {
                        Put: {
                            Item: {
                                product_id: productId,
                                count: data.count,
                            },
                            TableName: StocksTable,
                            ConditionExpression: 'attribute_not_exists(product_id)'
                        }
                    }
                ]
            }
        ).promise();
    } catch(e) {
        return formatInternalServerErrorResponse({
            message: 'could not add product',
        });
    }

    return formatJSONResponse({
        message: 'product successfully added',
    });
};

export const main = middyfy(createProduct);
