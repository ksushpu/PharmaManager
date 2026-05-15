from django.contrib import admin
from .models import Supplier, SupplierProduct, SupplierPreference

@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_active']
    search_fields = ['name']

@admin.register(SupplierProduct)
class SupplierProductAdmin(admin.ModelAdmin):
    list_display = ['product_name', 'dosage', 'supplier', 'supplier_quantity', 'is_available']
    list_filter = ['supplier', 'is_available']
    search_fields = ['product_name']

@admin.register(SupplierPreference)
class SupplierPreferenceAdmin(admin.ModelAdmin):
    list_display = ['product', 'supplier', 'rating']
    list_filter = ['rating']# Register your models here.
