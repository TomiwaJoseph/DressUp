from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics
from rest_framework.response import Response
from .serializers import CategorySerializer, DressSerializer,  RegisterSerializer, UserSerializer
from base.models import Category, Dress, DressImages
from random import seed, shuffle
from django.contrib.auth import authenticate
from rest_framework import status


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


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user': serializer.data,
        })


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        token = Token.objects.get_or_create(user=user)
        if user:
            return Response({
                'user_info': {
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email
                },
                'token': user.auth_token.key
            })
        return Response({"error": 'Wrong Credentials'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def logout(request):
    request.user.auth_token.delete()
    data = {'success': 'Successfully logged out.'}
    return Response(data=data, status=status.HTTP_200_OK)


class LogOutView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        print('oh jesu...')
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)


class UserAPI(generics.RetrieveAPIView):
    # permission_classes = (IsAuthenticated)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
