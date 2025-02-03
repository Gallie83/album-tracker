import { Issuer, Client } from 'openid-client';

let client: Client;

// Environment Variables
const user_pool_id: string = process.env.AMAZON_USER_POOL_ID || "";
const client_id: string = process.env.AMAZON_CLIENT_ID || "";
const client_secret: string = process.env.AMAZON_CLIENT_SECRET || "";

export const initializeCognitoClient = async() => {
    const issuer = await Issuer.discover(`https://cognito-idp.us-east-1.amazonaws.com/${user_pool_id}`);

    client = new issuer.Client({
        client_id: `${client_id}`,
        client_secret: `${client_secret}`,
        redirect_uris: ['http://localhost:5000/callback/'],
        response_types: ['code']
    });
};

export { client }