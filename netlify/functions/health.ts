import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: 'OK',
            message: '兽医大亨后端服务运行中 (Netlify Functions)',
            timestamp: new Date().toISOString(),
            environment: 'serverless'
        })
    };
};
