// Verify Google OAuth token and create session
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);
exports.handler = async (event) => {
    // CORS headers
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
        const { token } = JSON.parse(event.body);
        if (!token) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Token is required' })
            };
        }
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.VITE_GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        // Ensure email is verified
        if (!payload.email_verified) {
            return {
                statusCode: 403,
                headers,
                body: JSON.stringify({ error: 'Email not verified' })
            };
        }
        // Create session token
        const sessionToken = jwt.sign(
            {
                email: payload.email,
                name: payload.name,
                picture: payload.picture
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );
        // Set secure HttpOnly cookie
        const cookieOptions = [
            `token=${sessionToken}`,
            'HttpOnly',
            'Secure',
            'SameSite=Strict',
            'Max-Age=28800', // 8 hours
            'Path=/'
        ].join('; ');
        return {
            statusCode: 200,
            headers: {
                ...headers,
                'Set-Cookie': cookieOptions
            },
            body: JSON.stringify({
                success: true,
                user: {
                    email: payload.email,
                    name: payload.name,
                    picture: payload.picture
                }
            })
        };
    } catch (error) {
        console.error('Token verification error:', error);
        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ error: 'Invalid token' })
        };
    }
};
