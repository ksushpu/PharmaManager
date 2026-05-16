from django.contrib import admin
from .models import Order

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'pharmacy', 'supplier', 'product_name', 'dosage', 'quantity', 'status', 'created_at']
    list_filter = ['status', 'supplier', 'pharmacy']
    search_fields = ['product_name']