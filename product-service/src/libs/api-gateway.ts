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

export const formatNotFoundResponse = (response: Record<string, unknown>) => {
  return {
    statusCode: 404,
    ...cors,
    body: JSON.stringify(response)
  }
}
