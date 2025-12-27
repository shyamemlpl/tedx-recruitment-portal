# TEDx Recruitment Portal - Complete Setup Guide

This guide will walk you through every step of setting up your recruitment portal, from start to finish.

## Prerequisites Checklist

Before you begin, make sure you have:
- ✅ A Google account
- ✅ Your existing Google Form URL
- ✅ Access to the Google Sheet that receives form responses
- ✅ A GitHub account (for deployment)
- ✅ Node.js installed on your computer

---

## Part 1: Google Cloud Console Setup (15 minutes)

### Step 1.1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click **"Select a project"** at the top → **"New Project"**
3. Enter project name: `TEDx-Recruitment`
4. Click **"Create"**
5. Wait for the project to be created (notification will appear)

---

### Step 1.2: Enable Required APIs

1. In the search bar at the top, type: **"Google Sheets API"**
2. Click on **Google Sheets API** → Click **"Enable"**
3. Wait for it to enable
4. Click the back arrow, search for: **"Google Identity Services"**
5. Click **"Enable"** again

---

### Step 1.3: Create OAuth 2.0 Credentials

1. In the left sidebar, click **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted to configure consent screen:
   - Click **"CONFIGURE CONSENT SCREEN"**
   - Choose **"External"** → Click **"Create"**
   - Fill in required fields:
     - App name: `TEDxPrahladnagar Recruitment`
     - User support email: Your email
     - Developer contact: Your email
   - Click **"Save and Continue"** (skip optional sections)
   - Click **"Back to Dashboard"**

4. Back on Credentials page, click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
5. Application type: **"Web application"**
6. Name: `TEDx Portal`
7. Under **"Authorized JavaScript origins"**, click **"+ ADD URI"**:
   - Add: `http://localhost:5173` (for local testing)
   - Add: `https://your-site.netlify.app` (we'll update this later)
8. Under **"Authorized redirect URIs"**, add:
   - `http://localhost:5173`
9. Click **"CREATE"**
10. **IMPORTANT**: Copy the **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
    - Keep this window open or save it to a text file

---

### Step 1.4: Create Service Account

1. Click **"+ CREATE CREDENTIALS"** → **"Service account"**
2. Service account details:
   - Name: `tedx-sheets-access`
   - ID: Auto-filled
   - Click **"CREATE AND CONTINUE"**
3. Grant access: Select role **"Editor"** → Click **"CONTINUE"**
4. Click **"DONE"**
5. Click on the service account you just created
6. Go to **"KEYS"** tab → **"ADD KEY"** → **"Create new key"**
7. Choose **JSON** → Click **"CREATE"**
8. A JSON file will download - **SAVE IT SECURELY** (don't share this!)

---

## Part 2: Google Form Setup (10 minutes)

### Step 2.1: Add Verification Field to Form

1. Open your Google Form
2. Click **"+"** to add a question
3. Question type: **Short answer**
4. Question: `Verification Token`
5. Toggle **"Required"** OFF (we'll handle this programmatically)
6. **IMPORTANT**: This field won't be shown to users - it's for security

---

### Step 2.2: Extract Form Entry IDs

**Method 1: Inspect Element (Easiest)**

1. Open your form in **Google Chrome**
2. Fill in the first field (Name)
3. Right-click on the Name field → Click **"Inspect"**
4. Look for: `name="entry.XXXXXXXXXX"` (where X is a number)
5. Copy this number - this is your entry ID!
6. Repeat for ALL fields

**Method 2: Network Tab**

1. Open your form
2. Press **F12** to open Developer Tools
3. Go to **"Network"** tab
4. Fill in all fields with test data
5. Click **"Submit"**
6. In Network tab, click on **"formResponse"**
7. Scroll down to see **Form Data** - you'll see all entry IDs!

**Example:**
```
entry.123456789: John Doe          ← Name field
entry.987654321: 25                ← Age field
entry.555555555: +91 1234567890    ← Contact field
```

---

### Step 2.3: Update form-entries.json

1. Open the file: `config/form-entries.json`
2. Replace each `entry.REPLACE_WITH_ID` with the actual entry ID you found
3. Example:

```json
{
  "formUrl": "https://docs.google.com/forms/d/e/YOUR_ACTUAL_FORM_ID/formResponse",
  "fields": {
    "common": {
      "name": "entry.123456789",           ← Update this
      "age": "entry.987654321",            ← Update this
      "contact": "entry.555555555",        ← Update this
      ...
    }
  }
}
```

4. **Save the file**

---

## Part 3: Google Sheets Setup (10 minutes)

### Step 3.1: Share Sheet with Service Account

1. Open the **JSON key file** you downloaded earlier
2. Find the line: `"client_email": "tedx-sheets-access@....iam.gserviceaccount.com"`
3. **Copy this entire email address**
4. Open your **Google Sheet** (the one receiving form responses)
5. Click **"Share"** button (top right)
6. Paste the service account email
7. Give it **"Editor"** access
8. **Uncheck** "Notify people"
9. Click **"Share"**

---

### Step 3.2: Create Security_Log Sheet

1. In your Google Sheet, click **"+"** at the bottom to add a new sheet
2. Rename it to: `Security_Log` (exact spelling!)
3. In the first row, add these headers:
   - Column A: `Timestamp`
   - Column B: `Submission_Email`
   - Column C: `Verification_Status`
   - Column D: `IP_Address`
   - Column E: `Action_Taken`
4. **Bold** the header row

---

### Step 3.3: Add Status Column to Main Sheet

1. Go back to your main form responses sheet
2. Find an empty column (usually after all your questions)
3. Add header: `Status`
4. This is where you'll update: `Under Review`, `Selected`, or `Rejected`

---

### Step 3.4: Set Up Apps Script

1. In your Google Sheet, click **"Extensions"** → **"Apps Script"**
2. Delete any existing code
3. Open the file: `docs/google-apps-script.js` in VS Code
4. **Copy ALL the code**
5. Paste it into Apps Script editor
6. **UPDATE the configuration** at the top:

```javascript
const CONFIG = {
  VERIFICATION_SECRET: 'your_secret_here',  // We'll generate this later
  MAIN_SHEET_NAME: 'Form Responses 1',     // Your sheet name
  LOG_SHEET_NAME: 'Security_Log',
  EMAIL_COLUMN: 2,              // Column B
  VERIFICATION_COLUMN: 21,      // Adjust to match your sheet
  STATUS_COLUMN: 22             // Adjust to match your sheet
};
```

7. Click **"Save"** (disk icon)
8. Click **"Run"** → Select function: `testSetup`
9. Click **"Run"** again
10. You may see "Authorization required" → Click **"Review permissions"**
11. Choose your Google account → Click **"Advanced"** → **"Go to project (unsafe)"**
12. Click **"Allow"**
13. Check the **Execution log** - should say "Test Complete"

---

### Step 3.5: Set Up Trigger

1. In Apps Script, click **"Triggers"** (clock icon on left)
2. Click **"+ Add Trigger"** (bottom right)
3. Settings:
   - Function: `onFormSubmit`
   - Event source: `From spreadsheet`
   - Event type: `On form submit`
4. Click **"Save"**

---

## Part 4: Local Setup (5 minutes)

### Step 4.1: Create Environment File

1. In your project folder, create a file named: `.env`
2. Copy everything from `.env.example`
3. Fill in the values:

```bash
# From Step 1.3 (OAuth Client ID)
VITE_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com

# From Step 1.4 (Service Account JSON file)
GOOGLE_SERVICE_ACCOUNT_EMAIL=tedx-sheets-access@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key here\n-----END PRIVATE KEY-----\n"

# From your Google Sheet URL
GOOGLE_SHEET_ID=1AbCdEfGhIjKlMnOpQrStUvWxYz

# Generate these secrets (see below)
JWT_SECRET=
VERIFICATION_SECRET=
```

---

### Step 4.2: Generate Secrets

Open **Terminal/PowerShell** in your project folder and run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This will output a random string like: `a1b2c3d4...`

1. Copy this and paste as `JWT_SECRET`
2. Run the command again to get a different string
3. Copy this and paste as `VERIFICATION_SECRET`
4. **IMPORTANT**: Copy the same `VERIFICATION_SECRET` to Apps Script (Step 3.4)

---

### Step 4.3: Update Apps Script with Secret

1. Go back to Apps Script
2. Update the `VERIFICATION_SECRET` to match your `.env` file
3. Click **"Save"**

---

## Part 5: Testing Locally (10 minutes)

### Step 5.1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 5.2: Start Dev Server

```bash
netlify dev
```

This starts the site at: `http://localhost:8888` (not 5173!)

### Step 5.3: Test the Flow

1. Open `http://localhost:8888` in your browser
2. Click **"Apply Now"**
3. You should see **"Sign in with Google"** button
4. Click it and sign in
5. Fill out the form
6. Submit
7. Check your Google Sheet - new row should appear!
8. Check `Security_Log` sheet - should show "VALID" entry

---

## Part 6: Deploy to Netlify (15 minutes)

### Step 6.1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/tedx-recruitment.git
git push -u origin main
```

### Step 6.2: Connect to Netlify

1. Go to [Netlify](https://netlify.com)
2. Sign in with GitHub
3. Click **"Add new site"** → **"Import an existing project"**
4. Choose **GitHub** → Select your repository
5. Build settings (should auto-detect):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **"Deploy site"**

### Step 6.3: Add Environment Variables

1. In Netlify, go to **"Site settings"** → **"Environment variables"**
2. Click **"Add a variable"**
3. Add ALL variables from your `.env` file:
   - `VITE_GOOGLE_CLIENT_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (paste the ENTIRE key with `\n`)
   - `GOOGLE_SHEET_ID`
   - `JWT_SECRET`
   - `VERIFICATION_SECRET`

### Step 6.4: Update OAuth Authorized Origins

1. Go back to **Google Cloud Console** → **Credentials**
2. Click on your OAuth Client ID
3. Under **"Authorized JavaScript origins"**, add:
   - `https://your-actual-site.netlify.app` (replace with your Netlify URL)
4. Click **"Save"**

### Step 6.5: Trigger Redeploy

1. In Netlify, go to **"Deploys"**
2. Click **"Trigger deploy"** → **"Deploy site"**

---

## Part 7: Final Verification

### Test Checklist

- [ ] Visit your Netlify URL
- [ ] Click "Apply Now" → Should redirect to login
- [ ] Sign in with Google → Should work
- [ ] Fill and submit form → Should succeed
- [ ] Check Google Sheet → New row appears
- [ ] Check Security_Log → Shows "VALID"
- [ ] Update status in sheet to "Selected"
- [ ] Go to "Check Status" → Should show "Selected"

---

## Troubleshooting

### "Google Sign-In failed"
- Check OAuth Client ID is correct in `.env`
- Verify authorized origins include your Netlify URL

### "Failed to generate verification token"
- Check Netlify environment variables are set correctly
- Verify `JWT_SECRET` and `VERIFICATION_SECRET` are set

### "Application not found" in status checker
- Verify service account has access to the sheet
- Check `GOOGLE_SHEET_ID` is correct
- Ensure email matches exactly

### Apps Script shows "INVALID" submissions
- Check `VERIFICATION_SECRET` matches between `.env` and Apps Script
- Verify column indices in Apps Script config

---

## Need Help?

If you get stuck:
1. Check the browser console for errors (F12)
2. Check Netlify function logs
3. Check Apps Script execution logs
4. Verify all environment variables are set correctly

---

## 🎉 You're Done!

Your recruitment portal is now live! Team members can update the `Status` column in Google Sheets, and applicants will see the updates when they check their status.
