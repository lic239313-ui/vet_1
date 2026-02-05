import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
    // 允许跨域预检请求
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: ''
        };
    }

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            status: 'OK',
            message: '兽医大亨后端服务运行中 (Netlify Functions)',
            timestamp: new Date().toISOString(),
            environment: 'serverless'
        })
    };
};
