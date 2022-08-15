from rest_framework import serializers
from django.contrib.auth import get_user_model
from users.models import CustomUser
from rest_framework.authtoken.models import Token
# from base.models import Dresses


class DressSerializer(serializers.Serializer):
    class Meta:
        # model = Dresses
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser(email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        Token.objects.create(user=user)
        return user
