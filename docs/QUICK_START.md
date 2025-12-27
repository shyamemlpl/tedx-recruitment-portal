# Quick Start Guide - TEDx Recruitment Portal

**Estimated Time:** 1 hour total

This is a condensed version for experienced developers. For detailed step-by-step instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md).

## Prerequisites

- Node.js installed
- Google account
- GitHub account
- Existing Google Form

---

## 1. Google Cloud (15 min)

```bash
# Create project at console.cloud.google.com
# Enable: Google Sheets API, Google Identity Services
# Create OAuth 2.0 credentials (Web app)
# Create Service Account → Download JSON key
```

**Save:**
- OAuth Client ID: `VITE_GOOGLE_CLIENT_ID`
- Service account email & private key

---

## 2. Google Form (5 min)

```bash
# Add hidden field: "Verification Token" (short answer)
# Extract entry IDs using browser DevTools
# Update: config/form-entries.json
```

---

## 3. Google Sheet (10 min)

```bash
# Share sheet with service account email (Editor access)
# Create new sheet: "Security_Log" with headers:
#   Timestamp | Submission_Email | Verification_Status | IP_Address | Action_Taken
# Add "Status" column to main sheet
# Extensions → Apps Script → Paste code from docs/google-apps-script.js
# Set up trigger: onFormSubmit → On form submit
```

---

## 4. Environment Setup (5 min)

Create `.env`:

```bash
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_SERVICE_ACCOUNT_EMAIL=service@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-sheet-id
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
VERIFICATION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

**Copy `VERIFICATION_SECRET` to Apps Script config!**

---

## 5. Test Locally (5 min)

```bash
npm install -g netlify-cli
netlify dev
# Visit http://localhost:8888
```

---

## 6. Deploy (10 min)

```bash
# Push to GitHub
git init && git add . && git commit -m "Initial"
git remote add origin https://github.com/YOU/tedx-recruitment.git
git push -u origin main

# In Netlify:
# - Import GitHub repo
# - Add environment variables
# - Deploy

# Update Google OAuth:
# - Add Netlify URL to authorized origins
```

---

## Done! 🎉

Visit your site → Test apply flow → Check Google Sheet
