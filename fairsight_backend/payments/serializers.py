from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order_id', 'payment_id', 'amount', 'currency', 'status', 'created_at']
        read_only_fields = ['order_id', 'payment_id', 'status', 'created_at']

class PaymentCreateSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    currency = serializers.CharField(default='INR', max_length=3)
    receipt = serializers.CharField(required=False, allow_blank=True)

class PaymentVerifySerializer(serializers.Serializer):
    razorpay_payment_id = serializers.CharField(max_length=100)
    razorpay_order_id = serializers.CharField(max_length=100)
    razorpay_signature = serializers.CharField(max_length=100) 