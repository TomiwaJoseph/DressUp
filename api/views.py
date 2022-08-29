from django.conf import settings
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
import stripe
from decouple import config

stripe.api_key = settings.STRIPE_SECRET_KEY


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
    try:
        dress = Dress.objects.get(slug=slug)
    except Dress.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
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
        if user:
            token = Token.objects.get_or_create(user=user)
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


class UserAPI(generics.RetrieveAPIView):
    # permission_classes = (IsAuthenticated)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


@api_view(['POST'])
def stripe_payment(request):
    payment_intent = stripe.PaymentIntent.create(
        amount=1000,
        currency='usd',
        payment_method_types=['card'],
        receipt_email=config('EMAIL_HOST_USER')
    )
    return Response(status=status.HTTP_200_OK, data=payment_intent)


@api_view(['POST'])
def save_stripe_info(request):
    data = request.data
    email = data['email']
    payment_method_id = data['payment_method_id']
    amount = data['amount']
    extra_msg = ''
    # checking if customer with provided email already exists
    customer_data = stripe.Customer.list(email=email).data
    # print(customer_data)

    if len(customer_data) == 0:
        # creating customer
        customer = stripe.Customer.create(
            email=email,
            payment_method=payment_method_id,
            invoice_settings={
                'default_payment_method': payment_method_id
            }
        )
    else:
        customer = customer_data[0]
        extra_msg = "Customer already existed."

    # creating paymentIntent

    stripe.PaymentIntent.create(
        customer=customer,
        payment_method=payment_method_id,
        currency='usd', amount=amount*100,
        confirm=True
    )
    return Response(status=status.HTTP_200_OK, data={
        'message': 'Success',
        'data': {
            'customer_id': customer.id,
            'customer_email': customer.email,
            'extra_msg': extra_msg
        }
    })
    # return Response({'brymo': 'Cookie Crumbles'})
