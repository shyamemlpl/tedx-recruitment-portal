/**
 * TEDxPrahladnagar Recruitment Portal - Google Apps Script
 * 
 * This script validates form submissions and logs security events.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code and paste this entire file
 * 4. Update the CONFIGURATION section below
 * 5. Click "Deploy" → "New deployment" → "Web app"
 * 6. Set up trigger: Triggers → Add → onFormSubmit → From spreadsheet → On form submit
 */

// ===== CONFIGURATION - UPDATE THESE VALUES =====
const CONFIG = {
    // Your verification secret (MUST match VERIFICATION_SECRET in Netlify)
    VERIFICATION_SECRET: 'd8ebb2f8c1b772d135d599cfd9dac4343ff',

    // Sheet names
    MAIN_SHEET_NAME: 'Form Responses 1', // Your form responses sheet
    LOG_SHEET_NAME: 'Security_Log',      // Security log sheet

    // Column indices (1-indexed). Update based on your form structure.
    // Form columns order:
    // 1: Timestamp (auto)
    // 2: Email (entry.1026846730)
    // 3: Name (entry.1717546578)
    // 4: Age (entry.1388774102)
    // 5: Contact (entry.840684034)
    // 6: Occupation (entry.1549407303)
    // 7: Institute (entry.1781195273)
    // 8: Ahmedabad Based (entry.1331769159)
    // 9: LinkedIn (entry.381169301)
    // 10: Team Selection (entry.1429642501)
    // 11-14: Content Team (4 fields)
    // 15-18: Curation Team (4 fields)
    // 19-23: Design Team (5 fields)
    // 24-27: Host Team (4 fields)
    // 28-30: Operations Team (3 fields)
    // 31-35: Marketing Team (5 fields)
    // 36-40: Production Team (5 fields)
    // 41: About You (entry.1428196788)
    // 42: Verification Token (entry.1023342376)
    // 43: Status (manually added column)
    EMAIL_COLUMN: 2,              // Column B - Email address
    VERIFICATION_COLUMN: 42,      // Column where verification token is stored
    STATUS_COLUMN: 43             // Column where you'll mark status
};

// ===== MAIN VALIDATION FUNCTION =====
function onFormSubmit(e) {
    try {
        const sheet = e.range.getSheet();
        const row = e.range.getRow();
        const values = e.values;

        // Only process main sheet
        if (sheet.getName() !== CONFIG.MAIN_SHEET_NAME) return;

        const email = values[CONFIG.EMAIL_COLUMN - 1];
        const verificationToken = values[CONFIG.VERIFICATION_COLUMN - 1];

        // Validate token
        if (!isValidToken(email, verificationToken)) {
            // Mark row as suspicious (red background)
            sheet.getRange(row, 1, 1, sheet.getLastColumn())
                .setBackground('#ffcccc');

            // Add "INVALID" to status column
            sheet.getRange(row, CONFIG.STATUS_COLUMN).setValue('INVALID');

            // Log security event
            logSecurityEvent(email, 'INVALID', 'Suspicious submission - invalid token');

        } else {
            // Valid submission
            sheet.getRange(row, CONFIG.STATUS_COLUMN).setValue('Under Review');
            logSecurityEvent(email, 'VALID', 'Verified submission');
        }

    } catch (error) {
        Logger.log('Error in onFormSubmit: ' + error.toString());
    }
}

// ===== TOKEN VALIDATION =====
function isValidToken(email, token) {
    if (!token || token === '') return false;

    const now = new Date().getTime();

    // Check tokens within 10-minute window
    for (let i = 0; i < 10; i++) {
        const testTimestamp = now - (i * 60000);
        const expectedToken = generateToken(email, testTimestamp);

        if (expectedToken === token) {
            return true;
        }
    }

    return false;
}

// ===== TOKEN GENERATION - Must match Netlify function =====
function generateToken(email, timestamp) {
    const data = email + '|' + Math.floor(timestamp / 60000) + '|' + CONFIG.VERIFICATION_SECRET;
    const signature = Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        data,
        Utilities.Charset.UTF_8
    );

    return signature.map(function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('');
}

// ===== SECURITY LOGGING =====
function logSecurityEvent(email, status, action) {
    try {
        const ss = SpreadsheetApp.getActiveSpreadsheet();
        let logSheet = ss.getSheetByName(CONFIG.LOG_SHEET_NAME);

        // Create log sheet if it doesn't exist
        if (!logSheet) {
            logSheet = ss.insertSheet(CONFIG.LOG_SHEET_NAME);
            logSheet.appendRow(['Timestamp', 'Email', 'Status', 'IP_Address', 'Action']);
            logSheet.getRange(1, 1, 1, 5).setFontWeight('bold');
        }

        logSheet.appendRow([
            new Date(),
            email,
            status,
            'N/A',  // IP not available from Apps Script
            action
        ]);

    } catch (error) {
        Logger.log('Error logging security event: ' + error.toString());
    }
}

// ===== TEST FUNCTION - Run this to verify setup =====
function testSetup() {
    const testEmail = 'test@example.com';
    const testToken = generateToken(testEmail, new Date().getTime());

    Logger.log('=== TEDx Apps Script Test ===');
    Logger.log('Test Email: ' + testEmail);
    Logger.log('Generated Token: ' + testToken);
    Logger.log('Token Valid: ' + isValidToken(testEmail, testToken));

    // Test logging
    logSecurityEvent(testEmail, 'TEST', 'Manual test run from Apps Script');
    Logger.log('Security log entry created');

    Logger.log('=== Test Complete ===');
}

// ===== UTILITY: Reset all INVALID statuses to Under Review =====
function resetInvalidStatuses() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.MAIN_SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    let count = 0;
    for (let i = 1; i < data.length; i++) {
        if (data[i][CONFIG.STATUS_COLUMN - 1] === 'INVALID') {
            sheet.getRange(i + 1, CONFIG.STATUS_COLUMN).setValue('Under Review');
            sheet.getRange(i + 1, 1, 1, sheet.getLastColumn()).setBackground(null);
            count++;
        }
    }

    Logger.log('Reset ' + count + ' invalid entries');
}

// ===== UTILITY: Get status counts =====
function getStatusCounts() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.MAIN_SHEET_NAME);
    const data = sheet.getDataRange().getValues();

    const counts = {
        'Under Review': 0,
        'Selected': 0,
        'Rejected': 0,
        'INVALID': 0,
        'Other': 0
    };

    for (let i = 1; i < data.length; i++) {
        const status = data[i][CONFIG.STATUS_COLUMN - 1];
        if (counts.hasOwnProperty(status)) {
            counts[status]++;
        } else {
            counts['Other']++;
        }
    }

    Logger.log('=== Status Counts ===');
    for (const [status, count] of Object.entries(counts)) {
        Logger.log(status + ': ' + count);
    }

    return counts;
}
