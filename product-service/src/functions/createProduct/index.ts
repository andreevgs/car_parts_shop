import { handlerPath } from '@libs/handler-resolver';
import schema from "@functions/createProduct/schema";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
        bodyType: 'createProductBody'
      },
    },
  ],
};
