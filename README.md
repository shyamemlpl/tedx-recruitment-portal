# TEDxPrahladnagar Recruitment Portal

A secure, modern recruitment portal with Google Form integration, built with React + Vite and deployed on Netlify.

## Features

- 🔐 **Google OAuth Login** - Secure authentication with verified email
- 📝 **Multi-step Application Form** - Beautiful, validated form with team-specific questions
- 📊 **Status Checker** - Applicants can check their application status
- 🛡️ **Security** - Token verification, rate limiting, CSRF protection
- 📱 **Responsive** - Works on all devices
- 🆓 **Free Hosting** - Netlify + Google Sheets

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd tedx-recruitment
npm install
```

### 2. Set Up Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable APIs:
   - Google Sheets API
   - Google Identity Services
4. Create OAuth 2.0 credentials (Web application)
5. Create a Service Account and download the JSON key
6. Share your Google Sheet with the service account email

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 4. Set Up Google Apps Script

1. Open your Google Sheet
2. Go to Extensions → Apps Script
3. Copy the code from `docs/google-apps-script.js`
4. Update the configuration values
5. Set up trigger: Triggers → Add → onFormSubmit → From spreadsheet → On form submit

### 5. Update Form Entry IDs

Edit `config/form-entries.json` with your Google Form entry IDs.

### 6. Run Locally

```bash
npm run dev
```

### 7. Deploy to Netlify

1. Push to GitHub
2. Connect to Netlify
3. Add environment variables in Netlify dashboard
4. Deploy!

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email |
| `GOOGLE_PRIVATE_KEY` | Service account private key |
| `GOOGLE_SHEET_ID` | Your Google Sheet ID |
| `JWT_SECRET` | Random 64-char string for sessions |
| `VERIFICATION_SECRET` | Random 32-char string for tokens |

## Project Structure

```
tedx-recruitment/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context (auth)
│   ├── pages/          # Page components
│   └── utils/          # Helper functions
├── netlify/functions/  # Serverless backend
├── config/             # Configuration files
├── docs/               # Documentation
└── public/             # Static assets
```

## For Team Members

### Updating Application Status

1. Open your Google Sheet
2. Find the applicant's row
3. Update the Status column:
   - `Under Review` - Application received
   - `Selected` - Applicant accepted
   - `Rejected` - Application declined

### Viewing Security Logs

Check the `Security_Log` sheet for:
- Valid/Invalid submission attempts
- Timestamps and actions

## License

This project is for TEDxPrahladnagar internal use.
