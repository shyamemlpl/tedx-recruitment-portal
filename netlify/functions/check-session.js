// Check existing session from cookie
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': process.env.URL || '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    try {
        const cookies = event.headers.cookie || '';
        const tokenMatch = cookies.match(/token=([^;]+)/);

        if (!tokenMatch) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'No session' })
            };
        }

        const sessionToken = tokenMatch[1];
        const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                user: {
                    email: decoded.email,
                    name: decoded.name,
                    picture: decoded.picture
                }
            })
        };

    } catch (error) {
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid session' })
        };
    }
};
