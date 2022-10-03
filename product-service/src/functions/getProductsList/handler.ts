import {formatInternalServerErrorResponse, formatJSONResponse} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import AWS from "aws-sdk"
import {APIGatewayProxyEvent} from "aws-lambda";

const ProductsTable = process.env.PRODUCTS_TABLE;
const StocksTable = process.env.STOCKS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getProducts = async (event: APIGatewayProxyEvent) => {
    console.log("ENVIRONMENT VARIABLES\n" + JSON.stringify(process.env, null, 2))
    console.info("EVENT\n" + JSON.stringify(event, null, 2))

    const productsTableParams = {
        TableName: ProductsTable,
    };
    const stocksTableParams = {
        TableName: StocksTable,
    };

    try {
        const products = await dynamoDb.scan(productsTableParams).promise();
        const stocks = await dynamoDb.scan(stocksTableParams).promise();

        const productsStocksJoined =
            products.Items.length && stocks.Items.length ?
                stocks.Items.map((item, index) => {
                    return {count: item.count, ...products.Items[index]}
                }) : {};

        return formatJSONResponse({
            products: productsStocksJoined,
        });
    } catch (e) {
        return formatInternalServerErrorResponse({
            message: 'could not process request',
        });
    }

};

export const main = middyfy(getProducts);
