import razorpay
import json
from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Payment
from .serializers import PaymentSerializer, PaymentCreateSerializer, PaymentVerifySerializer

# Initialize Razorpay client
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Payment.objects.all()
        return Payment.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'], serializer_class=PaymentCreateSerializer, permission_classes=[AllowAny])
    def create_order(self, request):
        try:
            serializer = PaymentCreateSerializer(data=request.data)
            if serializer.is_valid():
                amount = int(float(serializer.validated_data.get('amount')) * 100)  # Convert to paise
                currency = serializer.validated_data.get('currency', 'INR')
                receipt = serializer.validated_data.get('receipt', '')
                
                try:
                    # Create a Razorpay Order
                    razorpay_order = client.order.create({
                        'amount': amount,
                        'currency': currency,
                        'receipt': receipt,
                        'payment_capture': '1'  # Auto capture the payment
                    })
                    
                    # Create a Payment record
                    user = request.user if request.user.is_authenticated else None
                    payment = Payment.objects.create(
                        user=user,
                        order_id=razorpay_order['id'],
                        amount=amount / 100,
                        currency=currency,
                        receipt=receipt,
                        status='created'
                    )
                    
                    # Return the order details
                    return Response({
                        'id': payment.id,
                        'order_id': razorpay_order['id'],
                        'amount': amount / 100,
                        'currency': currency,
                        'key_id': settings.RAZORPAY_KEY_ID,
                        'razorpay_order': razorpay_order
                    })
                except razorpay.errors.BadRequestError as e:
                    return Response({
                        'error': f"Razorpay error: {str(e)}"
                    }, status=status.HTTP_400_BAD_REQUEST)
                except Exception as e:
                    return Response({
                        'error': f"Failed to create order: {str(e)}"
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({
                    'error': 'Invalid data provided',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'error': f"Unexpected error: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'], serializer_class=PaymentVerifySerializer, permission_classes=[AllowAny])
    def verify_payment(self, request):
        serializer = PaymentVerifySerializer(data=request.data)
        if serializer.is_valid():
            razorpay_payment_id = serializer.validated_data.get('razorpay_payment_id')
            razorpay_order_id = serializer.validated_data.get('razorpay_order_id')
            razorpay_signature = serializer.validated_data.get('razorpay_signature')
            
            try:
                # Verify the payment signature
                params_dict = {
                    'razorpay_payment_id': razorpay_payment_id,
                    'razorpay_order_id': razorpay_order_id,
                    'razorpay_signature': razorpay_signature
                }
                
                client.utility.verify_payment_signature(params_dict)
                
                # Update Payment record
                payment = Payment.objects.get(order_id=razorpay_order_id)
                payment.payment_id = razorpay_payment_id
                payment.status = 'captured'
                
                # Store additional payment data
                payment_details = client.payment.fetch(razorpay_payment_id)
                payment.payment_data = payment_details
                payment.save()
                
                return Response({
                    'success': True,
                    'message': 'Payment verified successfully',
                    'payment': PaymentSerializer(payment).data
                })
            except razorpay.errors.SignatureVerificationError:
                return Response({
                    'success': False,
                    'message': 'Invalid signature'
                }, status=status.HTTP_400_BAD_REQUEST)
            except Payment.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Payment not found'
                }, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({
                    'success': False,
                    'message': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Simple view for pricing page with Razorpay checkout
def pricing_page(request):
    return render(request, 'payments/pricing.html', {
        'key_id': settings.RAZORPAY_KEY_ID
    })
