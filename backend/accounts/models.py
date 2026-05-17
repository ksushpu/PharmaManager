from django.db import models
from django.contrib.auth.models import AbstractUser
from pharmacy.models import Pharmacy
from suppliers.models import Supplier


class User(AbstractUser):
    ROLE_CHOICES = [
        ('director', 'Директор аптеки'),
        ('supplier', 'Поставщик'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, verbose_name="Роль")
    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Телефон")

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"