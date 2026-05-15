from django.shortcuts import render
from rest_framework import viewsets
from .models import Supplier, SupplierProduct, SupplierPreference
from .serializers import SupplierSerializer, SupplierProductSerializer, SupplierPreferenceSerializer

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer

class SupplierProductViewSet(viewsets.ModelViewSet):
    serializer_class = SupplierProductSerializer

    def get_queryset(self):
        qs = SupplierProduct.objects.all()
        sid = self.request.query_params.get('supplier_id')
        if sid:
            qs = qs.filter(supplier_id=sid)
        return qs

class SupplierPreferenceViewSet(viewsets.ModelViewSet):
    queryset = SupplierPreference.objects.all()
    serializer_class = SupplierPreferenceSerializer