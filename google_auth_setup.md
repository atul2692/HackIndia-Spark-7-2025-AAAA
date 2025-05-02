# Google OAuth Setup Instructions

This document explains how to complete the setup for Google Sign-In in your FairSight AI application.

## 1. Create a Google OAuth Client

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" and select "OAuth client ID"
5. Select "Web application" as the application type
6. Set a name for your client (e.g., "FairSight AI")
7. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain when ready
8. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (for development)
   - Your production callback URL when ready
9. Click "Create"
10. Note down your Client ID and Client Secret

## 2. Update Django Settings

1. Open `fairsight_backend/fairsight_backend/settings.py`
2. Update the Google OAuth configuration with your Client ID and Secret:

```python
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': 'YOUR_CLIENT_ID',
            'secret': 'YOUR_CLIENT_SECRET',
            'key': ''
        },
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    }
}
```

## 3. Update Frontend Configuration

1. Open `fairsight-ai/app/signin/page.tsx` and `fairsight-ai/app/signup/page.tsx`
2. Replace `YOUR_GOOGLE_CLIENT_ID` with your actual Google Client ID in the `handleGoogleSignIn` and `handleGoogleSignUp` functions:

```typescript
window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_ACTUAL_CLIENT_ID&redirect_uri=${encodeURIComponent('http://localhost:3000/api/auth/google/callback')}&response_type=code&scope=email%20profile`;
```

## 4. Configure Django AllAuth Site

After starting your Django server for the first time:

1. Go to the Django admin interface (`http://localhost:8000/admin/`)
2. Log in with your superuser credentials
3. Navigate to "Sites" and edit the default site
4. Update the domain name to match your application domain (e.g., `localhost:8000` for development)
5. Save the changes

## 5. Test the Integration

1. Start your Django backend:
   ```
   cd fairsight_backend
   python run.py
   ```

2. Start your Next.js frontend:
   ```
   cd fairsight-ai
   npm run dev
   ```

3. Visit `http://localhost:3000/signin` and test the Google Sign-In button

## Troubleshooting

If you encounter any issues:

1. Check the Django logs for backend errors
2. Check the browser console for frontend errors
3. Verify that your Client ID and Secret are correctly configured
4. Confirm that your redirect URIs match exactly what's configured in the Google Cloud Console
5. Ensure CORS is properly configured to allow requests between your frontend and backend

## Production Considerations

Before deploying to production, consider:

1. Updating the OAuth redirect URIs to your production domains
2. Setting up proper HTTPS for secure OAuth flows
3. Implementing more robust error handling
4. Adding rate limiting for authentication attempts
5. Setting up proper session management and token security 