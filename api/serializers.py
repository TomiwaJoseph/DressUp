from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import CustomUser
from rest_framework.authtoken.models import Token
from base.models import Dress, Category


class DressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dress
        fields = ['id', 'name', 'price',
                  'discount_price', 'slug', 'main_image', ]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser(
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        Token.objects.create(user=user)
        return user
