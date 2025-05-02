from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FairnessAnalysisViewSet, DatasetViewSet, ModelViewSet, feedback_list, feedback_detail
from .auth_views import GoogleLoginView, google_auth_callback, get_csrf_token, logout_view
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class CustomGoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:8000/accounts/google/login/callback/"
    client_class = OAuth2Client

router = DefaultRouter()
router.register(r'analyses', FairnessAnalysisViewSet)
router.register(r'datasets', DatasetViewSet)
router.register(r'models', ModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Google Auth endpoints
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),
    path('auth/google/callback/', google_auth_callback, name='google_callback'),
    path('auth/google/login/', CustomGoogleLoginView.as_view(), name='google_login_view'),
    path('auth/logout/', logout_view, name='auth_logout'),
    path('csrf-token/', get_csrf_token, name='get_csrf_token'),
    # Feedback endpoints - using standard Django views now
    path('feedback/', feedback_list, name='feedback_list'),
    path('feedback/<int:pk>/', feedback_detail, name='feedback_detail'),
] 