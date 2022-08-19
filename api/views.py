from random import seed, shuffle
from unicodedata import category
from urllib import response
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework import status

from base.models import Category, Dress, DressImages
from .serializers import UserSerializer, DressSerializer, CategorySerializer
from rest_framework.response import Response
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.views import APIView


@api_view(['GET'])
def get_highest__price(request):
    data = max([object.price for object in Dress.objects.all()])
    return Response(data)


@api_view(['GET'])
def get_hottest__dresses(request):
    data = list(Dress.objects.all())
    seed(4)
    shuffle(data)
    serializer = DressSerializer(data[:7], many=True).data
    return Response(serializer)


@api_view(['POST'])
def filter_category_price(request):
    # Get the values passed in the request parameters
    request_data = request.data

    minValue = request_data.get('minValue')
    maxValue = request_data.get('maxValue')
    category = request_data.get('categories')

    # Query for the dresses
    if category == ['All Dresses']:
        data = Dress.objects.filter(
            discount_price__gte=minValue,
            discount_price__lte=maxValue,
        )
    else:
        data = Dress.objects.filter(
            category__title__in=category,
            discount_price__gte=minValue,
            discount_price__lte=maxValue,
        )

    serializer = DressSerializer(data, many=True).data
    return Response(serializer)


@api_view(['GET'])
def get_single__dress(request, slug):
    try:
        single_dress = Dress.objects.get(slug=slug)
        related_images_queryset = DressImages.objects.filter(
            dress_id=single_dress.id)
        related_images_url = [single_dress.main_image.url] + \
            [url.image.url for url in related_images_queryset]
        data = Dress.objects.get(slug=slug)
    except Dress.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    serializer = DressSerializer(data).data
    new_dict = {'all_dress_images': related_images_url,
                'category': single_dress.category.title}
    new_dict.update(serializer)
    return Response(new_dict, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_related__dress(request, slug):
    dress = Dress.objects.get(slug=slug)
    data = Dress.objects.filter(
        category__title=dress.category).exclude(id=dress.id)
    serializer = DressSerializer(data[:5], many=True).data
    return Response(serializer)


@api_view(['GET'])
def get_all_dresses_or_category(request, slug):
    if slug == 'all-dresses':
        data = list(Dress.objects.all())
        seed(5)
        shuffle(data)
    else:
        try:
            category = Category.objects.get(slug=slug)
        except Category.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        data = Dress.objects.filter(category=category)
    serializer = DressSerializer(data, many=True).data
    return Response(serializer)


@api_view(['GET'])
def get_all__categories(request):
    data = Category.objects.all()
    serializer = CategorySerializer(data, many=True).data
    return Response(serializer)


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
