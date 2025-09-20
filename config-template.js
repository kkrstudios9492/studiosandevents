// OAuth Configuration Template
// Copy this file to config.js and replace the placeholder values with your actual OAuth credentials

const OAUTH_CONFIG = {
    // Google OAuth Configuration
    GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    
    // Facebook App Configuration  
    FACEBOOK_APP_ID: 'YOUR_FACEBOOK_APP_ID',
    
    // Optional: Add other OAuth providers here
    // TWITTER_CLIENT_ID: 'YOUR_TWITTER_CLIENT_ID',
    // LINKEDIN_CLIENT_ID: 'YOUR_LINKEDIN_CLIENT_ID',
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OAUTH_CONFIG;
}

