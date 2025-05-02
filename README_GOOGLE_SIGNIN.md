# Google Sign-In Implementation for FairSight AI

This document provides an overview of the Google Sign-In feature implementation in the FairSight AI application.

## Architecture Overview

The Google Sign-In feature uses the following components:

1. **Backend (Django)**
   - Django AllAuth for social authentication
   - Django REST framework and dj-rest-auth for API endpoints
   - JWT tokens for authentication

2. **Frontend (Next.js)**
   - Client-side authentication flow
   - Auth context provider for state management
   - Sign-in and sign-up pages with Google buttons

## How It Works

### Authentication Flow

1. User clicks "Sign in with Google" button on the frontend
2. User is redirected to Google's OAuth consent screen
3. After consent, Google redirects back to our callback URL with an auth code
4. The frontend sends this code to the backend
5. The backend verifies the code with Google and receives user information
6. If the user doesn't exist, a new account is created
7. JWT tokens are generated and returned to the frontend
8. The frontend stores these tokens and updates the authentication state

## Setting Up Google OAuth

To complete the setup, follow these steps:

1. **Create a Google OAuth Client ID**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Create an OAuth client ID for a web application
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback` (development)
     - Your production callback URL when deployed

2. **Update Backend Configuration**
   - Update `settings.py` with your Google OAuth credentials:
     ```python
     SOCIALACCOUNT_PROVIDERS = {
         'google': {
             'APP': {
                 'client_id': 'YOUR_CLIENT_ID',
                 'secret': 'YOUR_CLIENT_SECRET',
                 'key': ''
             },
             # ... other settings
         }
     }
     ```

3. **Update Frontend Configuration**
   - In the sign-in and sign-up pages, update the Google OAuth URL with your client ID:
     ```typescript
     window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=${encodeURIComponent('http://localhost:3000/api/auth/google/callback')}&response_type=code&scope=email%20profile`;
     ```

## Running the Application

1. **Start the Django backend**
   ```
   cd fairsight_backend
   python run.py
   ```

2. **Start the Next.js frontend**
   ```
   cd fairsight-ai
   npm run dev
   ```

3. Open a browser and navigate to `http://localhost:3000/signin`

## Security Considerations

- Always use HTTPS in production
- Keep client secrets secure and never expose them in frontend code
- Implement proper CSRF protection
- Use secure cookies and session management
- Implement rate limiting for authentication endpoints

## Customization

To customize the Google Sign-In UI:

1. Modify the sign-in and sign-up page components
2. Update the `AuthProvider` component to add additional auth methods
3. Extend the Django models and serializers to store additional user data

## Additional Resources

- [Google OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Django AllAuth Documentation](https://django-allauth.readthedocs.io/)
- [dj-rest-auth Documentation](https://dj-rest-auth.readthedocs.io/)
- [JWT Authentication with Django REST Framework](https://django-rest-framework-simplejwt.readthedocs.io/) 