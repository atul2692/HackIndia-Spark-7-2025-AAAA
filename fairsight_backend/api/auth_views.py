from django.http import JsonResponse
from django.conf import settings
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth import login, authenticate, get_user_model, logout
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

# New complete logout view
@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def logout_view(request):
    """
    Clear the session and handle proper logout
    """
    try:
        # Django logout to clear the session
        logout(request)
        
        response = Response({"detail": "Successfully logged out."})
        
        # Clear any auth cookies
        response.delete_cookie('fairsight-auth')
        response.delete_cookie('fairsight-refresh')
        
        # Make sure to expire any session cookies
        response.delete_cookie('sessionid')
        response.delete_cookie('csrftoken')
        
        return response
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    
    def get_callback_url(self):
        # Get the redirect URI from the request, or use default
        data = self.request.data
        return data.get('redirect_uri', "http://localhost:8000/accounts/google/login/callback/")
    
    def get_response(self):
        response = super().get_response()
        # Add additional user info if needed
        if self.user:
            response.data['user'] = {
                'id': self.user.id,
                'email': self.user.email,
                'first_name': self.user.first_name,
                'last_name': self.user.last_name,
            }
        return response

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def google_auth_callback(request):
    """
    Handle Google OAuth callback and generate JWT tokens
    """
    try:
        code = request.data.get('code')
        redirect_uri = request.data.get('redirect_uri', "http://localhost:8000/accounts/google/login/callback/")
        
        if not code:
            return Response({'error': 'Authorization code is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Process Google auth code
        adapter = GoogleOAuth2Adapter()
        client = OAuth2Client(request=request, redirect_uri=redirect_uri)
        token = adapter.get_access_token(request, code)
        
        # Get user info from Google
        user_data = adapter.get_user_info(token)
        email = user_data.get('email')
        
        # Get or create user
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=None,  # Password not needed for social auth
                first_name=user_data.get('given_name', ''),
                last_name=user_data.get('family_name', '')
            )
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_csrf_token(request):
    """
    Get CSRF token for frontend
    """
    token = get_token(request)
    return Response({'csrfToken': token}) 