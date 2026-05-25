from django.db import models
from pharmacy.models import Product

class Supplier(models.Model):
    RATING_CHOICES = [
        (1, 'Наиболее предпочтительный'),
        (2, 'Среднее предпочтение'),
        (3, 'Наименее предпочтительный'),
    ]
    name = models.CharField(max_length=255, verbose_name="Название поставщика")
    contact_info = models.TextField(blank=True, null=True, verbose_name="Контактная информация")
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    rating = models.IntegerField(default=3, choices=RATING_CHOICES, verbose_name="Рейтинг")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Поставщик"
        verbose_name_plural = "Поставщики"

    def __str__(self):
        return self.name


class SupplierProduct(models.Model):
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='products')
    product_name = models.CharField(max_length=255, verbose_name="Название товара")
    dosage = models.CharField(max_length=100, verbose_name="Фасовка")
    supplier_quantity = models.IntegerField(default=0, verbose_name="Количество у поставщика")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Цена поставщика")
    is_available = models.BooleanField(default=True, verbose_name="Доступен для заказа")
    expiry_date = models.DateField(verbose_name="Срок годности")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Товар поставщика"
        verbose_name_plural = "Товары поставщиков"
        unique_together = ['supplier', 'product_name', 'dosage']

    def __str__(self):
        return f"{self.product_name} ({self.dosage}) - {self.supplier.name}"


class SupplierPreference(models.Model):
    RATING_CHOICES = [
        (1, 'Наиболее предпочтительный'),
        (2, 'Среднее предпочтение'),
        (3, 'Наименее предпочтительный'),
    ]

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='supplier_preferences')
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='product_preferences')
    rating = models.IntegerField(choices=RATING_CHOICES, verbose_name="Рейтинг предпочтения")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Предпочтение поставщика"
        verbose_name_plural = "Предпочтения поставщиков"
        unique_together = ['product', 'supplier']

    def __str__(self):
        return f"{self.product.name} -> {self.supplier.name} (Рейтинг: {self.rating})"