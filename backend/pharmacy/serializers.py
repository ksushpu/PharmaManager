from rest_framework import serializers
from .models import Pharmacy, Product

class PharmacySerializer(serializers.ModelSerializer):
    class Meta:
        model = Pharmacy
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_is_expired(self, obj):
        return obj.is_expired()