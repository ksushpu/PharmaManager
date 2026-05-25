from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import date
from .models import Order
from .serializers import OrderSerializer
from suppliers.models import SupplierProduct
from pharmacy.models import Product


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        qs = Order.objects.all()
        pharmacy_id = self.request.query_params.get('pharmacy_id')
        supplier_id = self.request.query_params.get('supplier_id')
        if pharmacy_id:
            qs = qs.filter(pharmacy_id=pharmacy_id)
        if supplier_id:
            qs = qs.filter(supplier_id=supplier_id)
        return qs

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        order = self.get_object()
        if order.status != 'pending':
            return Response({'error': 'Только ожидающий заказ'}, status=400)
        order.status = 'confirmed'
        order.save()

        sp = SupplierProduct.objects.filter(
            supplier=order.supplier, product_name=order.product_name, dosage=order.dosage
        ).first()
        if sp:
            sp.supplier_quantity = max(0, sp.supplier_quantity - order.quantity)
            sp.save()

        product = Product.objects.filter(pharmacy=order.pharmacy, name=order.product_name).first()
        if product:
            product.quantity += order.quantity
            product.save()
        else:
            Product.objects.create(
                pharmacy=order.pharmacy,
                name=order.product_name,
                price=100,
                dosages=[{"dosage": order.dosage}],
                quantity=order.quantity,
                expiry_date=sp.expiry_date if sp and sp.expiry_date else date.today(),
            )

        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        order = self.get_object()
        if order.status != 'pending':
            return Response({'error': 'Только ожидающий заказ'}, status=400)
        order.status = 'rejected'
        order.rejection_reason = request.data.get('reason', '')
        order.save()
        return Response(OrderSerializer(order).data)