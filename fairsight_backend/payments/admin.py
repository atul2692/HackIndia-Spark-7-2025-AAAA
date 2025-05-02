from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'payment_id', 'amount', 'currency', 'status', 'created_at')
    list_filter = ('status', 'currency')
    search_fields = ('order_id', 'payment_id', 'receipt')
    readonly_fields = ('order_id', 'payment_id', 'created_at', 'updated_at', 'payment_data')
