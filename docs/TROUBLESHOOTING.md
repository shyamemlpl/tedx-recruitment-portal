# Troubleshooting Guide

Common issues and how to fix them.

---

## Login Issues

### ❌ "Google Sign-In failed" or redirect loops

**Causes:**
- OAuth Client ID incorrect
- Authorized origins not configured

**Fixes:**
1. Check `.env` has correct `VITE_GOOGLE_CLIENT_ID`
2. In Google Cloud Console → Credentials → OAuth Client:
   - Authorized JavaScript origins should include:
     - `http://localhost:8888` (for local)
     - `https://your-site.netlify.app` (for production)
3. Redeploy after changes

---

### ❌ "Email not verified" error

**Cause:** User's Google account email isn't verified

**Fix:** User must verify their email through Google

---

## Form Submission Issues

### ❌ Form submits but nothing appears in Google Sheet

**Causes:**
- Form URL incorrect
- Entry IDs wrong
- CORS issue

**Fixes:**
1. Check `config/form-entries.json`:
   - `formUrl` should be correct (ending in `/formResponse`)
   - Entry IDs match your form
2. Open browser DevTools → Network tab → Submit form → Check for errors
3. Verify verification token field exists in form

---

### ❌ Submissions marked "INVALID" in Google Sheet

**Cause:** Verification token mismatch

**Fixes:**
1. Ensure `VERIFICATION_SECRET` matches between:
   - `.env` file
   - Netlify environment variables
   - Apps Script config
2. Check Apps Script column indices are correct:
   ```javascript
   EMAIL_COLUMN: 2,           // Column B
   VERIFICATION_COLUMN: 21,   // Update to match your sheet
   ```
3. Run Apps Script test function: `testSetup()`

---

## Status Checker Issues

### ❌ "Application not found"

**Causes:**
- Email mismatch
- Service account doesn't have access
- Sheet ID wrong

**Fixes:**
1. Verify user applied with same Google account
2. Check service account email has Editor access to sheet
3. Verify `GOOGLE_SHEET_ID` in `.env` is correct
4. Check Google Sheet name matches `MAIN_SHEET_NAME` in Apps Script

---

### ❌ "Too many requests" error

**Cause:** Rate limiting (5 requests per 15 minutes)

**Fix:** This is by design for security. Wait 15 minutes or increase limit in `get-status.js`:
```javascript
const RATE_LIMIT = 10; // Increase from 5
```

---

### ❌ Status shows old value (caching issue)

**Cause:** Response is cached for 5 minutes

**Fixes:**
- Wait 5 minutes for cache to expire
- Or reduce cache TTL in `get-status.js`:
  ```javascript
  const CACHE_TTL = 1 * 60 * 1000; // 1 minute instead of 5
  ```

---

## Netlify Function Issues

### ❌ "Failed to fetch" or 500 errors

**Causes:**
- Environment variables not set
- Service account key malformed

**Fixes:**
1. Check Netlify → Site settings → Environment variables
2. Ensure `GOOGLE_PRIVATE_KEY` includes `\n` characters:
   ```
   "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n"
   ```
3. Check Netlify function logs for detailed errors

---

### ❌ "Authentication failed" in functions

**Cause:** JWT_SECRET mismatch or expired session

**Fixes:**
1. Clear browser cookies
2. Verify `JWT_SECRET` is set in Netlify
3. Log out and log back in

---

## Apps Script Issues

### ❌ "Authorization required" every time

**Cause:** Trigger not set up correctly

**Fix:**
1. Apps Script → Triggers → Verify trigger exists:
   - Function: `onFormSubmit`
   - Event: `On form submit`
2. If missing, add it again

---

### ❌ Script execution logs show errors

**Common errors:**

**"Cannot find sheet 'Security_Log'"**
- Create the Security_Log sheet
- Check spelling is exact

**"Cannot read property of undefined"**
- Column indices wrong in config
- Check `EMAIL_COLUMN`, `VERIFICATION_COLUMN`, `STATUS_COLUMN`

---

## Build/Deploy Issues

### ❌ Build fails on Netlify

**Causes:**
- Missing dependencies
- Environment variables not set during build

**Fixes:**
1. Check build logs for specific error
2. Ensure `VITE_GOOGLE_CLIENT_ID` is set (needed at build time)
3. Try: `npm run build` locally first

---

### ❌ "Module not found" errors

**Cause:** Missing npm packages

**Fix:**
```bash
npm install
```

For functions specifically:
```bash
npm install google-auth-library googleapis jsonwebtoken
```

---

## Browser Console Errors

### Common Errors & Meanings:

**"Failed to load resource: net::ERR_BLOCKED_BY_CLIENT"**
- Ad blocker or privacy extension blocking Google APIs
- Disable for your site

**"Refused to load the script"**
- CSP (Content Security Policy) blocking
- Check `netlify.toml` CSP includes Google domains

**"CORS policy" errors**
- Check Netlify function origin validation
- Ensure request is from correct domain

---

## Getting Detailed Logs

### Frontend Logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. Network tab shows API calls

### Backend Logs (Netlify Functions)
1. Netlify dashboard → Functions tab
2. Click on a function → View logs
3. Shows last executions and errors

### Apps Script Logs
1. Apps Script editor → Executions
2. Shows trigger runs and errors
3. Use `Logger.log()` to add custom logs

---

## Still Stuck?

1. **Check ALL environment variables** are set correctly:
   ```bash
   # In Netlify, compare with your local .env
   ```

2. **Verify Google Cloud permissions:**
   - APIs enabled
   - OAuth consent screen configured
   - Service account has Sheet access

3. **Test each part separately:**
   - Can you login? (Tests OAuth)
   - Can you submit? (Tests form integration)
   - Can you check status? (Tests Sheets API)

4. **Common checklist:**
   - [ ] .env file has all 6 variables
   - [ ] Netlify has all 6 environment variables
   - [ ] Apps Script has matching VERIFICATION_SECRET
   - [ ] Service account shared with Sheet
   - [ ] OAuth authorized origins include your URLs
   - [ ] Form entry IDs are correct

---

## Error Reference

| Error Message | Location | Fix |
|--------------|----------|-----|
| "Invalid token" | Login | Check VITE_GOOGLE_CLIENT_ID |
| "Not authenticated" | Any function | Clear cookies, re-login |
| "Email mismatch" | Form submit | Use same Google account |
| "Application not found" | Status checker | Check Sheet ID & service account |
| "Too many requests" | Status checker | Wait 15 min or adjust rate limit |
| "Invalid session" | Any auth action | Re-login |
| "INVALID" status | Google Sheet | Check VERIFICATION_SECRET matches |
