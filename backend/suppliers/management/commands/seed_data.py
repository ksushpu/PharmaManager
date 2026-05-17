from django.core.management.base import BaseCommand
from pharmacy.models import Pharmacy, Product
from suppliers.models import Supplier, SupplierProduct, SupplierPreference
from datetime import date


class Command(BaseCommand):
    help = 'Заполнение базы тестовыми данными'

    def handle(self, *args, **kwargs):
        pharmacy, _ = Pharmacy.objects.get_or_create(
            name='Аптека "Здоровье"',
            defaults={
                'current_date': date(2026, 5, 12),
                'address': 'г. Москва, ул. Тверская, д. 1',
                'phone': '+7 (495) 123-45-67'
            }
        )

        s1, _ = Supplier.objects.get_or_create(name='ФармКомплект', defaults={'contact_info': '+7 (900) 111-11-11'})
        s2, _ = Supplier.objects.get_or_create(name='Здоровье Плюс', defaults={'contact_info': '+7 (900) 222-22-22'})
        s3, _ = Supplier.objects.get_or_create(name='МедикаОпт', defaults={'contact_info': '+7 (900) 333-33-33'})
        suppliers = [s1, s2, s3]

        products_data = [
            {'name': 'Аспирин', 'dosages': [{'dosage': '500 мг'}], 'price': 120, 'quantity': 50, 'expiry': date(2026, 5, 15)},
            {'name': 'Ибупрофен', 'dosages': [{'dosage': '200 мг'}, {'dosage': '400 мг'}], 'price': 250, 'quantity': 12, 'expiry': date(2025, 10, 10)},
            {'name': 'Парацетамол', 'dosages': [{'dosage': '500 мг'}], 'price': 80, 'quantity': 100, 'expiry': date(2027, 1, 20)},
            {'name': 'Омепразол', 'dosages': [{'dosage': '20 мг'}], 'price': 340, 'quantity': 5, 'expiry': date(2026, 4, 20)},
        ]

        for pd in products_data:
            p, _ = Product.objects.get_or_create(
                name=pd['name'], pharmacy=pharmacy,
                defaults={
                    'price': pd['price'],
                    'dosages': pd['dosages'],
                    'quantity': pd['quantity'],
                    'expiry_date': pd['expiry']
                }
            )
            for i, s in enumerate(suppliers):
                SupplierPreference.objects.get_or_create(product=p, supplier=s, defaults={'rating': i + 1})

        inventory = {
            s1: [('Аспирин', '500 мг', 500), ('Ибупрофен', '200 мг', 300), ('Ибупрофен', '400 мг', 200)],
            s2: [('Ибупрофен', '400 мг', 150), ('Парацетамол', '500 мг', 1000), ('Омепразол', '20 мг', 50)],
            s3: [('Аспирин', '500 мг', 100), ('Омепразол', '20 мг', 800)],
        }

        for sup, items in inventory.items():
            for name, dosage, qty in items:
                SupplierProduct.objects.get_or_create(
                    supplier=sup, product_name=name, dosage=dosage,
                    defaults={'supplier_quantity': qty, 'price': 100}
                )

        self.stdout.write(self.style.SUCCESS('Тестовые данные созданы'))