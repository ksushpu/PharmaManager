from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import models
from datetime import date
from .models import Pharmacy, Product
from .serializers import PharmacySerializer, ProductSerializer

class PharmacyViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Pharmacy.objects.all()
    serializer_class = PharmacySerializer

class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.all()
        pharmacy_id = self.request.query_params.get('pharmacy_id')
        if pharmacy_id:
            queryset = queryset.filter(pharmacy_id=pharmacy_id)
        return queryset

    @action(detail=False, methods=['post'])
    def write_off_expired(self, request):
        pharmacy_id = request.data.get('pharmacy_id')
        if not pharmacy_id:
            return Response({'error': 'Укажите pharmacy_id'}, status=400)
        
        pharmacy = Pharmacy.objects.get(id=pharmacy_id)
        
        # Если фронтенд прислал свою дату — используем её
        current_date = request.data.get('current_date')
        if current_date:
            pharmacy.current_date = current_date
            pharmacy.save()
        
        expired = Product.objects.filter(
            pharmacy_id=pharmacy_id,
            expiry_date__lt=pharmacy.current_date,
            quantity__gt=0
        )
        count = expired.count()
        expired.update(quantity=0)
        return Response({'message': f'Списано: {count}', 'count': count})

    @action(detail=False, methods=['get'])
    def total_value(self, request):
        pharmacy_id = request.query_params.get('pharmacy_id')
        if not pharmacy_id:
            return Response({'error': 'Укажите pharmacy_id'}, status=400)
        total = Product.objects.filter(pharmacy_id=pharmacy_id).aggregate(
            total=models.Sum(models.F('price') * models.F('quantity'))
        )['total'] or 0
        return Response({'total_value': float(total)})