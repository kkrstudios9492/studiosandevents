# OAuth Setup Instructions

This document provides step-by-step instructions for setting up Google and Facebook OAuth authentication for your KKR Studios application.

## Google OAuth Setup

### 1. Create Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API (if not already enabled)

### 2. Configure OAuth Consent Screen
1. In the Google Cloud Console, go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "KKR Studios"
   - User support email: your email
   - Developer contact information: your email
4. Add your domain to authorized domains
5. Add scopes: `email`, `profile`, `openid`

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost` (for development)
   - `https://yourdomain.com` (for production)
5. Add authorized redirect URIs:
   - `http://localhost/login.html` (for development)
   - `https://yourdomain.com/login.html` (for production)
6. Copy the Client ID

### 4. Update Configuration
Replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` in `script.js` with your actual Google Client ID.

## Facebook Login Setup

### 1. Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Consumer" app type
4. Fill in app details:
   - App name: "KKR Studios"
   - App contact email: your email
   - App purpose: "Other"

### 2. Configure Facebook Login
1. In your app dashboard, go to "Products" > "Facebook Login" > "Settings"
2. Add valid OAuth redirect URIs:
   - `http://localhost/login.html` (for development)
   - `https://yourdomain.com/login.html` (for production)
3. Enable "Client OAuth Login"
4. Enable "Web OAuth Login"

### 3. Get App ID
1. In your app dashboard, go to "Settings" > "Basic"
2. Copy the "App ID"

### 4. Update Configuration
Replace `YOUR_FACEBOOK_APP_ID` in `script.js` with your actual Facebook App ID.

## Testing

### Development Testing
1. Make sure you're running the application on `http://localhost`
2. Test both Google and Facebook login buttons
3. Check browser console for any errors
4. Verify that user accounts are created in localStorage

### Production Deployment
1. Update the authorized domains/URIs in both Google and Facebook consoles
2. Replace the placeholder credentials with your actual credentials
3. Test the login flows on your production domain

## Security Notes

- Never commit your actual OAuth credentials to version control
- Use environment variables or a secure configuration file for production
- Regularly rotate your OAuth credentials
- Monitor your OAuth usage in both Google and Facebook consoles

## Troubleshooting

### Common Issues
1. **"This app is not verified"** - This is normal for development. Users can click "Advanced" > "Go to [app name] (unsafe)" to proceed.
2. **CORS errors** - Make sure your domain is added to authorized origins in both Google and Facebook consoles.
3. **Invalid redirect URI** - Ensure the redirect URIs match exactly (including protocol and trailing slashes).

### Debug Mode
- Open browser developer tools (F12)
- Check the Console tab for error messages
- Check the Network tab for failed requests
- Verify that the OAuth SDKs are loading correctly

## Support
If you encounter issues:
1. Check the browser console for error messages
2. Verify your OAuth configuration in both Google and Facebook consoles
3. Ensure your domain is properly configured
4. Test with a different browser or incognito mode

