from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, UserSerializer
from suppliers.models import Supplier


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        if user.role == 'supplier':
            company_name = request.data.get('company', user.username)
            Supplier.objects.create(
                name=company_name,
                contact_info=f"Телефон: {user.phone or 'не указан'}",
                rating=3
            )
            user.supplier = Supplier.objects.get(name=company_name)
            user.save()
        
        return Response({'user': UserSerializer(user).data}, status=status.HTTP_201_CREATED)


class UserProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)