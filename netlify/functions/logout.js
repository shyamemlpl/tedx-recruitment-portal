// Logout - clear session cookie
exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': process.env.URL || '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers };
    }

    // Clear the session cookie
    const clearCookie = [
        'token=',
        'HttpOnly',
        'Secure',
        'SameSite=Strict',
        'Max-Age=0', // Expire immediately
        'Path=/'
    ].join('; ');

    return {
        statusCode: 200,
        headers: {
            ...headers,
            'Set-Cookie': clearCookie
        },
        body: JSON.stringify({ success: true })
    };
};
