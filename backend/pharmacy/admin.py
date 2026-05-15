from django.contrib import admin
from .models import Pharmacy, Product

@admin.register(Pharmacy)
class PharmacyAdmin(admin.ModelAdmin):
    list_display = ['name', 'current_date', 'address']
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'pharmacy', 'price', 'quantity', 'expiry_date']
    list_filter = ['pharmacy', 'expiry_date']
    search_fields = ['name']