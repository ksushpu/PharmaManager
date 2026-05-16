from django.db import models
from pharmacy.models import Pharmacy
from suppliers.models import Supplier


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает подтверждения'),
        ('confirmed', 'Подтверждён'),
        ('rejected', 'Отклонён'),
    ]

    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.CASCADE, related_name='orders')
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='orders')
    product_name = models.CharField(max_length=255, verbose_name="Название товара")
    dosage = models.CharField(max_length=100, verbose_name="Фасовка")
    quantity = models.IntegerField(verbose_name="Количество")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Статус")
    rejection_reason = models.TextField(blank=True, null=True, verbose_name="Причина отклонения")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"
        ordering = ['-created_at']

    def __str__(self):
        return f"Заказ #{self.id} - {self.pharmacy.name} -> {self.supplier.name}"