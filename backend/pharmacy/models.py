from django.db import models

class Pharmacy(models.Model):
    name = models.CharField(max_length=255, verbose_name="Название аптеки")
    current_date = models.DateField(verbose_name="Текущая дата аптеки")
    address = models.TextField(blank=True, null=True, verbose_name="Адрес")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Телефон")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Аптека"
        verbose_name_plural = "Аптеки"

    def __str__(self):
        return self.name


class Product(models.Model):
    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255, verbose_name="Название товара")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    quantity = models.IntegerField(default=0, verbose_name="Количество")
    expiry_date = models.DateField(verbose_name="Срок годности")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

    def __str__(self):
        return f"{self.name} (Аптека: {self.pharmacy.name})"

    def is_expired(self):
        from datetime import date
        return self.expiry_date < self.pharmacy.current_date