// Generate verification token for form submissions
const crypto = require('crypto');
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
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }
    try {
        // Verify session token from cookie
        const cookies = event.headers.cookie || '';
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (!tokenMatch) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Not authenticated' })
            };
        }
        const sessionToken = tokenMatch[1];
        const decoded = jwt.verify(sessionToken, process.env.JWT_SECRET);
        const { email } = JSON.parse(event.body);
        // Verify email matches session
        if (decoded.email !== email) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Email mismatch' })
            };
        }
        // Generate verification token
        // This token is checked by Google Apps Script
        const timestamp = Math.floor(Date.now() / 60000); // Minute precision
        const data = `${email}|${timestamp}|${process.env.VERIFICATION_SECRET}`;
        const token = crypto.createHash('sha256').update(data).digest('hex');
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ token })
        };
    } catch (error) {
        console.error('Token generation error:', error);
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Authentication failed' })
        };
    }
};
