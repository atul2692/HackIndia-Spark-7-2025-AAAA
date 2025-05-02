from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'', views.PaymentViewSet, basename='payment')

urlpatterns = [
    path('api/', include(router.urls)),
    path('pricing/', views.pricing_page, name='pricing_page'),
] 