import {formatInternalServerErrorResponse, formatJSONResponse} from '@libs/api-gateway';
import {middyfy} from '@libs/lambda';
import AWS from "aws-sdk"

const ProductsTable = process.env.PRODUCTS_TABLE;
const StocksTable = process.env.STOCKS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getProducts = async () => {
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

        console.log(products, stocks);
        return formatJSONResponse({
            products: productsStocksJoined,
        });
    } catch (e) {
        console.log(e);
        return formatInternalServerErrorResponse({
            message: 'could not process request',
        });
    }

};

export const main = middyfy(getProducts);
