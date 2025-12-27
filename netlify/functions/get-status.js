// Get application status from Google Sheets
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

// Rate limiting map (in-memory, resets on cold start)
const userRequests = new Map();
const RATE_LIMIT = 5; // requests
const RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

// Response cache
const statusCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
                body: JSON.stringify({ error: 'Can only check your own status' })
            };
        }

        // Rate limiting
        const now = Date.now();
        const userLimit = userRequests.get(email) || { count: 0, windowStart: now };

        if (now - userLimit.windowStart > RATE_WINDOW) {
            userLimit.count = 0;
            userLimit.windowStart = now;
        }

        userLimit.count++;
        userRequests.set(email, userLimit);

        if (userLimit.count > RATE_LIMIT) {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({
                    error: 'Too many requests',
                    retryAfter: Math.ceil((userLimit.windowStart + RATE_WINDOW - now) / 1000)
                })
            };
        }

        // Check cache
        const cacheKey = `status:${email}`;
        const cached = statusCache.get(cacheKey);
        if (cached && now - cached.timestamp < CACHE_TTL) {
            return {
                statusCode: 200,
                headers: { ...headers, 'X-Cache': 'HIT' },
                body: JSON.stringify(cached.data)
            };
        }

        // Initialize Google Sheets API
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Fetch data from sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Form Responses 1!A:Z' // Adjust range as needed
        });

        const rows = response.data.values || [];

        if (rows.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'No data found' })
            };
        }

        // Find header row and column indices
        const headers_row = rows[0];
        const emailCol = headers_row.findIndex(h =>
            h.toLowerCase().includes('email')
        );
        const nameCol = headers_row.findIndex(h =>
            h.toLowerCase().includes('name')
        );
        const teamCol = headers_row.findIndex(h =>
            h.toLowerCase().includes('team')
        );
        const statusCol = headers_row.findIndex(h =>
            h.toLowerCase().includes('status')
        );
        const timestampCol = 0; // Usually first column

        // Find user's row
        let userRow = null;
        for (let i = rows.length - 1; i >= 1; i--) { // Start from end (latest)
            if (rows[i][emailCol]?.toLowerCase() === email.toLowerCase()) {
                userRow = rows[i];
                break;
            }
        }

        if (!userRow) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: 'Application not found' })
            };
        }

        // Prepare response data
        const statusData = {
            name: userRow[nameCol] || decoded.name,
            email: email,
            team: userRow[teamCol] || 'Not specified',
            status: userRow[statusCol] || 'Under Review',
            submittedDate: userRow[timestampCol] || null
        };

        // Cache the response
        statusCache.set(cacheKey, {
            data: statusData,
            timestamp: now
        });

        return {
            statusCode: 200,
            headers: { ...headers, 'X-Cache': 'MISS' },
            body: JSON.stringify(statusData)
        };

    } catch (error) {
        console.error('Status check error:', error);

        if (error.name === 'JsonWebTokenError') {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid session' })
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Unable to fetch status' })
        };
    }
};
