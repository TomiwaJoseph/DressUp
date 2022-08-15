from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework import status
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.decorators import api_view

from api import serializers


@api_view(['GET'])
def getData(request):
    person = [{
        'name': 'Tomiwa',
        'age': 27
    }, {
        'name': 'John',
        'age': 29
    }]
    return Response(person)


class UserCreate(generics.CreateAPIView):
    serializer_class = UserSerializer


class LoginView(APIView):
    permission_classes = ()
    authentication_classes = ()

    def post(self, request):
        print('isinmi')
        print(authenticate(request, email="stephaniemiller@gmail.com",
              password="FiveThirtyEight"))
#         {
#     "email": "stephaniemiller@gmail.com",
#     "password": "FiveThirtyEight"
# }
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        print()
        if user:
            return Response({'token': user.auth_token.key})
        return Response({"error": 'Wrong Credentials'}, status=status.HTTP_400_BAD_REQUEST)
