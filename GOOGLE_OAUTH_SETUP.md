# Google OAuth Setup Guide

## 🚨 Current Issue
**Error**: `OAuth client was not found. Error 401: invalid_client`
**Cause**: Google OAuth credentials are not properly configured

## 📋 Step-by-Step Setup

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Sign in with your Google account

### 2. Create or Select a Project
- Click "Select a project" dropdown
- Either:
  - **Create New Project**: Click "NEW PROJECT" → Enter "Mohit Saree Center" → Create
  - **Use Existing Project**: Select an existing project

### 3. Enable Google+ API (Required for OAuth)
- Go to **"APIs & Services"** → **"Library"**
- Search for **"Google+ API"**
- Click on it and press **"ENABLE"**

### 4. Configure OAuth Consent Screen
- Go to **"APIs & Services"** → **"OAuth consent screen"**
- Choose **"External"** (for testing) → Click **"CREATE"**
- Fill in required fields:
  - **App name**: `Mohit Saree Center`
  - **User support email**: Your email
  - **Developer contact email**: Your email
- Click **"SAVE AND CONTINUE"**
- Skip "Scopes" → Click **"SAVE AND CONTINUE"**
- Skip "Test users" → Click **"SAVE AND CONTINUE"**

### 5. Create OAuth 2.0 Credentials
- Go to **"APIs & Services"** → **"Credentials"**
- Click **"+ CREATE CREDENTIALS"** → **"OAuth 2.0 Client IDs"**
- Application type: **"Web application"**
- Name: `Mohit Saree Center Web Client`

### 6. Configure Authorized URLs
**Authorized JavaScript origins:**
```
http://localhost:3000
```

**Authorized redirect URIs:**
```
http://localhost:3000/mohitsarees/api/auth/callback/google
```

### 7. Get Your Credentials
- Click **"CREATE"**
- Copy the **Client ID** and **Client Secret**
- Keep these secure!

### 8. Update Environment Variables
Replace the placeholder values in `.env.local`:

```env
# Replace these with your actual credentials
GOOGLE_CLIENT_ID=your-actual-client-id-from-google-console
GOOGLE_CLIENT_SECRET=your-actual-client-secret-from-google-console
```

### 9. Restart Development Server
```bash
npm run dev
```

### 10. Test the Setup
- Visit: http://localhost:3000/mohitsarees/auth/login
- Click "Continue with Google"
- Should redirect to Google OAuth (not show error)

## 🔧 Troubleshooting

### If you still get "OAuth client was not found":
1. Double-check Client ID and Secret are correct
2. Ensure no extra spaces in environment variables
3. Restart the development server
4. Clear browser cache

### If you get "redirect_uri_mismatch":
1. Verify redirect URI is exactly: `http://localhost:3000/mohitsarees/api/auth/callback/google`
2. Check for typos in Google Console settings

## 🌟 Production Setup (Later)
For production deployment, you'll need to:
1. Add your production domain to authorized origins
2. Add production callback URL
3. Update NEXTAUTH_URL in production environment

## 📝 Quick Reference
- **Google Console**: https://console.cloud.google.com/
- **Redirect URI**: `http://localhost:3000/mohitsarees/api/auth/callback/google`
- **Environment File**: `.env.local`
