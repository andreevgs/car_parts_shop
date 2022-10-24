import type { APIGatewayIAMAuthorizerResult, APIGatewayRequestIAMAuthorizerHandlerV2 } from 'aws-lambda';

const parseToken = (token: unknown): { username: string; password: string } | null => {
    if (typeof token !== 'string') return null;

    const decodedToken = Buffer.from(token, 'base64').toString('ascii');
    const [username, password] = decodedToken.split(':');

    if (!username || !password) return null;

    return { username, password };
};

const getAuthorizerOutput = (
    action: 'Allow' | 'Deny',
    arn: string,
    username?: string
): APIGatewayIAMAuthorizerResult => {
    return {
        principalId: username ?? 'user',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: action,
                    Resource: arn,
                },
            ],
        },
    };
};

export const basicAuthorizer: APIGatewayRequestIAMAuthorizerHandlerV2 = async (event) => {
    try {
        const [authHeaderValue] = event.identitySource;
        const [authType, token] = authHeaderValue.split(' ');
        if (typeof authType !== 'string' || authType.toLowerCase() !== 'basic') return getAuthorizerOutput('Deny', event.routeArn);

        const tokenData = parseToken(token);
        if (!tokenData) return getAuthorizerOutput('Deny', event.routeArn);

        const { username, password } = tokenData;
        const isPasswordCorrect = process.env[username] === password;
        if (!isPasswordCorrect) return getAuthorizerOutput('Deny', event.routeArn);

        return getAuthorizerOutput('Allow', event.routeArn, username);
    } catch (e) {
        console.log('Internal server error', e);
        return getAuthorizerOutput('Deny', event.routeArn);
    }
};