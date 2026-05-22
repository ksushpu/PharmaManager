# PharmaManager

Система управления аптекой и поставками.

## Стек

- **Бэкенд:** Django 5 + Django REST Framework + PostgreSQL
- **Фронтенд:** React 18 + Tailwind CSS + React Router

## Установка

### Бэкенд
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver
```

### Фронтенд
```bash
cd frontend
npm install
npm run dev
```