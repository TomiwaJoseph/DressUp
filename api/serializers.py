from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import Order
from rest_framework.authtoken.models import Token
from base.models import Dress, Category
from django.contrib.auth import authenticate

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']


class DressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dress
        fields = ['id', 'name', 'price',
                  'discount_price', 'slug', 'main_image', ]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name',
                  'email', 'password']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate_email(self, email):
        existing_emails = User.objects.filter(email=email).first()
        if existing_emails:
            raise serializers.ValidationError(
                "User with this email already exist. Wasn't you?")
        return email


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = "__all__"
