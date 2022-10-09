import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

const cors = {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
}

export const formatJSONResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 200,
    ...cors,
    body: JSON.stringify(response)
  }
}

export const formatBadRequestResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 400,
    ...cors,
    body: JSON.stringify(response)
  }
}

export const formatNotFoundResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 404,
    ...cors,
    body: JSON.stringify(response)
  }
}

export const formatInternalServerErrorResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 500,
    ...cors,
    body: JSON.stringify(response)
  }
}
