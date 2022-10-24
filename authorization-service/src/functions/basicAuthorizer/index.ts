import {handlerPath} from '@libs/handler-resolver';

export default {
    handler: `${handlerPath(__dirname)}/handler.basicAuthorizer`,
    description: 'Authorizer for API Gateway'
};
