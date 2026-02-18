# Fix Google OAuth Redirect URI Mismatch

## 🚨 Current Error
**Error 400: redirect_uri_mismatch**
**Message**: "You can't sign in because this app sent an invalid request"

## 🔍 Root Cause
The redirect URI in your Google Cloud Console doesn't match what NextAuth is sending.

## ✅ **EXACT REDIRECT URI TO USE**

Go to your Google Cloud Console and set this **EXACT** redirect URI:

```
http://localhost:3000/mohitsarees/api/auth/callback/google
```

## 📋 Step-by-Step Fix

### 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Select your project

### 2. Navigate to Credentials
- Go to **"APIs & Services"** → **"Credentials"**
- Find your OAuth 2.0 Client ID
- Click the **pencil icon** to edit

### 3. Update Authorized Redirect URIs
**Remove any existing redirect URIs and add this EXACT one:**

```
http://localhost:3000/mohitsarees/api/auth/callback/google
```

**Important Notes:**
- ✅ Use `http://` (not `https://` for localhost)
- ✅ Use `localhost:3000` (not `127.0.0.1`)
- ✅ Include `/mohitsarees/api/auth/callback/google` path
- ✅ No trailing slash
- ✅ Case sensitive - use exact capitalization

### 4. Also Set Authorized JavaScript Origins
```
http://localhost:3000
```

### 5. Save Changes
- Click **"SAVE"** in Google Console
- Wait 5-10 minutes for changes to propagate

### 6. Restart Your Development Server
```bash
npm run dev
```

## 🔧 Common Mistakes to Avoid

❌ **Wrong**: `http://localhost:3000/api/auth/callback/google`
✅ **Correct**: `http://localhost:3000/mohitsarees/api/auth/callback/google`

❌ **Wrong**: `https://localhost:3000/mohitsarees/api/auth/callback/google`
✅ **Correct**: `http://localhost:3000/mohitsarees/api/auth/callback/google`

❌ **Wrong**: `http://127.0.0.1:3000/mohitsarees/api/auth/callback/google`
✅ **Correct**: `http://localhost:3000/mohitsarees/api/auth/callback/google`

## 🧪 How to Test

1. **Update Google Console** with exact redirect URI above
2. **Wait 5-10 minutes** for Google to update
3. **Restart development server**: `npm run dev`
4. **Visit**: http://localhost:3000/mohitsarees/auth/login
5. **Click "Continue with Google"**
6. **Should redirect to Google** without error

## 🔍 Verify Your Setup

Your Google Cloud Console should have:

**OAuth 2.0 Client ID Settings:**
- **Application type**: Web application
- **Authorized JavaScript origins**: `http://localhost:3000`
- **Authorized redirect URIs**: `http://localhost:3000/mohitsarees/api/auth/callback/google`

## 🚀 Expected Result

After fixing:
- ✅ Google OAuth login works
- ✅ Redirects to Google sign-in page
- ✅ Returns to your app after authentication
- ✅ User is logged in successfully

## 📞 Still Having Issues?

If you still get redirect_uri_mismatch:
1. Double-check the exact URI in Google Console
2. Wait 10-15 minutes for Google's cache to update
3. Try in incognito/private browser window
4. Clear browser cache and cookies
