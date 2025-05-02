"""
URL configuration for fairsight_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from django.http import HttpResponseRedirect, JsonResponse
from django.conf import settings
import requests
import json
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

def oauth_callback_handler(request):
    """
    Handle the OAuth callback and redirect to the frontend landing page
    """
    # After Django allauth processes the OAuth callback,
    # redirect the user to the frontend landing page
    return HttpResponseRedirect('http://localhost:3000/')

@csrf_exempt
@require_POST
def manual_logout(request):
    """
    Manual logout view to clear session completely
    """
    logout(request)
    response = HttpResponseRedirect('http://localhost:3000/signin')
    response.delete_cookie('sessionid')
    response.delete_cookie('csrftoken')
    response.delete_cookie('fairsight-auth')
    response.delete_cookie('fairsight-refresh')
    return response

def google_auth_callback(request):
    """
    Handle Google OAuth callback directly
    """
    code = request.GET.get('code')
    if not code:
        return HttpResponseRedirect('http://localhost:3000/signin?error=missing_code')
    
    try:
        # Exchange the code for tokens
        client_id = settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
        client_secret = settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['secret']
        redirect_uri = 'http://localhost:8000/accounts/google/login/callback/'
        
        token_url = 'https://oauth2.googleapis.com/token'
        payload = {
            'code': code,
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code'
        }
        
        response = requests.post(token_url, data=payload)
        token_data = response.json()
        
        if 'error' in token_data:
            return HttpResponseRedirect(f'http://localhost:3000/signin?error={token_data["error"]}')
        
        # Success - get user info
        access_token = token_data.get('access_token')
        id_token = token_data.get('id_token')
        
        # Get user information from Google
        user_info_url = 'https://www.googleapis.com/oauth2/v3/userinfo'
        user_info_response = requests.get(
            user_info_url,
            headers={'Authorization': f'Bearer {access_token}'}
        )
        user_data = user_info_response.json()
        
        # Extract user data
        email = user_data.get('email')
        name = user_data.get('name', '')
        picture = user_data.get('picture', '')
        
        # Redirect to frontend landing page with tokens and user info
        redirect_url = (
            f'http://localhost:3000/?'
            f'access_token={access_token}&'
            f'id_token={id_token}&'
            f'email={email}&'
            f'name={name}&'
            f'picture={picture}&'
            f'authenticated=true'
        )
        return HttpResponseRedirect(redirect_url)
    
    except Exception as e:
        return HttpResponseRedirect(f'http://localhost:3000/signin?error=auth_error&message={str(e)}')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('payments/', include('payments.urls')),
    
    # JWT Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Django AllAuth endpoints
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('accounts/', include('allauth.urls')),
    
    # Add custom redirect for Google OAuth callback
    path('accounts/google/login/callback/complete/', oauth_callback_handler, name='oauth_callback_complete'),
    path('accounts/google/login/callback/', google_auth_callback, name='google_auth_callback'),
    path('logout/', manual_logout, name='manual_logout'),
    
    path('', RedirectView.as_view(url='api/', permanent=False)),
]
