import json
from collections import OrderedDict
from django.contrib.sessions.models import Session
from itertools import product
from pdb import Restart
from django.conf import settings
from requests import request
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics
from rest_framework.response import Response

from users.models import Wishlist

from users.models import Order, OrderItem
from .serializers import CategorySerializer, DressSerializer, OrderSerializer,  RegisterSerializer, UserSerializer
from base.models import Category, Dress, DressImages
import random
import string
from django.contrib.auth import authenticate
from rest_framework import status
import stripe
from decouple import config

from api import serializers

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_ref_code():
    return "".join(random.choices(string.ascii_lowercase + string.digits, k=25))


@api_view(['GET'])
def get_highest_price(request):
    data = max([object.price for object in Dress.objects.all()])
    return Response(data)


@api_view(['GET'])
def get_hottest_dresses(request):
    data = list(Dress.objects.all())
    random.seed(14)
    random.shuffle(data)
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
def get_single_dress(request, slug):
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
def get_related_dress(request, slug):
    try:
        dress = Dress.objects.get(slug=slug)
    except Dress.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    data = list(Dress.objects.filter(
        category__title=dress.category).exclude(id=dress.id))
    random.shuffle(data)
    serializer = DressSerializer(data[:5], many=True).data
    return Response(serializer)


@api_view(['GET'])
def get_all_dresses_or_category(request, slug):
    if slug == 'all-dresses':
        data = list(Dress.objects.all())
        random.seed(5)
        random.shuffle(data)
    else:
        try:
            category = Category.objects.get(slug=slug)
        except Category.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        data = Dress.objects.filter(category=category)
    serializer = DressSerializer(data, many=True).data
    return Response(serializer)


@api_view(['GET'])
def get_all_categories(request):
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


# class UserAPI(generics.RetrieveAPIView):
#     # permission_classes = (IsAuthenticated)
#     serializer_class = UserSerializer

#     def get_object(self):
#         return self.request.user


@api_view(['POST'])
def stripe_payment(request):
    payment_intent = stripe.PaymentIntent.create(
        amount=1000,
        currency='usd',
        payment_method_types=['card'],
        receipt_email=config('EMAIL_HOST_USER')
    )
    return Response(status=status.HTTP_200_OK, data=payment_intent)


@api_view(['GET'])
def get_order_history(request):
    return Response({'data': 'Get Order History.'})


@api_view(['POST'])
def add_to_wishlist(request):
    dress_id = request.data.get('dressId')
    token = request.data.get('token')
    product_to_add_to_wishlist = Dress.objects.get(id=dress_id)
    user = Token.objects.get(key=token).user
    check_wishlist_exist = Wishlist.objects.filter(user=user).first()
    if check_wishlist_exist:
        check_product_exist = dress_id in [
            i.id for i in check_wishlist_exist.folder.all()]
        if not check_product_exist:
            check_wishlist_exist.folder.add(product_to_add_to_wishlist)
    else:
        create_new = Wishlist.objects.create(user=user)
        create_new
        create_new.folder.add(product_to_add_to_wishlist)

    return Response({"status": "Success"})


@api_view(['POST'])
def get_wishlist_dresses(request):
    token = request.data.get('token')
    user = Token.objects.get(key=token).user
    user_wishlist = Wishlist.objects.filter(user=user).first()
    if user_wishlist:
        serializer = DressSerializer(
            user_wishlist.folder.all(), many=True).data
        return Response(serializer)
    return Response([])


@api_view(['POST'])
def delete_wishlist_dress(request):
    token = request.data.get('token')
    id = request.data.get('id')
    user = Token.objects.get(key=token).user
    wishlist_object_qs = Wishlist.objects.get(user=user)
    wishlist_object_qs.folder.remove(Dress.objects.get(id=id))
    wishlist_count = len(wishlist_object_qs.folder.all())
    return Response({"status": "success", "wishlist_count": wishlist_count})


@api_view(['GET'])
def get_cart_count(request):
    session_query = [s.get_decoded() for s in Session.objects.all()
                     if s.get_decoded().get('cart_data')]
    if session_query:
        cart = session_query[0]['cart_data']
        return Response(len(cart))
    return Response(0)


@api_view(['GET'])
def remove_cart(request):
    for s in Session.objects.all():
        if s.get_decoded().get('cart_data'):
            s.delete()
    return Response({"status": "Success"})


@api_view(['POST'])
def remove_cart_item(request):
    dress_id = request.data.get('dressId')
    session_data_query = [s.get_decoded() for s in Session.objects.all()
                          if s.get_decoded().get('cart_data')]
    cart = session_data_query[0]['cart_data']
    # new_cart = cart
    del cart[str(dress_id)]

    for s in Session.objects.all():
        if s.get_decoded().get('cart_data'):
            s.delete()

    request.session['cart_data'] = cart
    cart_count = len(request.session.get("cart_data", 0))
    return Response({"status": "Success", 'cart_count': cart_count})


@api_view(['POST'])
def change_cart_content(request):
    dress_id = request.data.get('dressId')
    quantity = request.data.get('quantity')
    action = request.data.get('action')

    all_dresses_id = [obj.id for obj in Dress.objects.all()]

    # if dress_id not in all_dresses_id or quantity > 5 or quantity < 1 or action not in ['increase', 'decrease']:
    #     return Response(status=status.HTTP_403_FORBIDDEN)

    session_data_query = [s.get_decoded() for s in Session.objects.all()
                          if s.get_decoded().get('cart_data')]
    cart = session_data_query[0]['cart_data']
    # new_cart = cart
    cart[str(dress_id)] = quantity - \
        1 if action == 'decrease' else quantity + 1
    # new_cart.update(new_cart)
    # print(cart)
    # print(new_cart)

    for s in Session.objects.all():
        if s.get_decoded().get('cart_data'):
            s.delete()

    request.session['cart_data'] = cart

    all_dress_ids = [int(id) for id in cart]
    all_dress_quantity = [
        value for value in cart.values()]
    all_dresses = [Dress.objects.get(id=item) for item in all_dress_ids]
    serializer = DressSerializer(all_dresses, many=True).data
    all_data = json.loads(json.dumps(serializer))
    new_cart = []
    for index, object in enumerate(all_data):
        new_object = object
        new_object.update({"quantity": all_dress_quantity[index]})
        new_cart.append(new_object)

    return Response({"new_cart": new_cart, "status": "Success"})


@api_view(['POST'])
def get_user_orders(request):
    token = request.data.get('token')
    user = Token.objects.get(key=token).user
    user_orders = list(Order.objects.filter(user=user))[::-1]
    serializer = OrderSerializer(user_orders, many=True).data
    return Response({"status": "Success", "user_orders": serializer})


@api_view(['GET'])
def get_cart_content(request):
    session_query = [s.get_decoded() for s in Session.objects.all()
                     if s.get_decoded().get('cart_data')]
    if session_query:
        all_dress_ids = [int(id) for id in session_query[0]['cart_data']]
        all_dress_quantity = [
            value for value in session_query[0]['cart_data'].values()]
        all_dresses = [Dress.objects.get(id=item) for item in all_dress_ids]
        serializer = DressSerializer(all_dresses, many=True).data
        all_data = json.loads(json.dumps(serializer))
        new_dict = []
        for index, object in enumerate(all_data):
            new_object = object
            new_object.update({"quantity": all_dress_quantity[index]})
            new_dict.append(new_object)
        return Response(new_dict)

    return Response([])


@api_view(['POST'])
def add_to_cart(request):
    dress_id = request.data.get('dressId')
    quantity = request.data.get('quantity')
    session_data_query = [s.get_decoded() for s in Session.objects.all()
                          if s.get_decoded().get('cart_data')]

    cart_content = {}
    cart_content[str(dress_id)] = quantity

    # If user is authenticated
    # if token_query:
    #     product_to_cart = Dress.objects.get(id=dress_id)
    #     # Check if order exist for the user
    #     order = Order.objects.filter(
    #         user=token_query.user, ordered=False).first()
    #     if not order:
    #         # Create a new order
    #         order = Order.objects.create(
    #             user=token_query.user,
    #             ref_code=create_ref_code(),
    #             ordered=False
    #         )
    #     # Check if order item exist
    #     order_item = OrderItem.objects.filter(product__id=dress_id).first()
    #     if order_item:
    #         order_item.quantity = quantity
    #         order_item.save()
    #     else:
    #         item_to_cart = OrderItem.objects.create(
    #             product=product_to_cart,
    #             order=order,
    #             quantity=quantity
    #         )
    #         order.product.add(item_to_cart.product)

    # If cart is in sesion storage
    if session_data_query:
        cart = session_data_query[0]['cart_data']
        # If the dress in in cart, update the quantity
        if str(dress_id) in cart:
            # new_cart = cart
            cart[str(dress_id)] = quantity
            # new_cart.update(new_cart)
        else:
            # Else add the new dress
            # new_cart = cart
            cart.update(cart_content)

        for s in Session.objects.all():
            if s.get_decoded().get('cart_data'):
                s.delete()

        request.session['cart_data'] = cart
    else:
        # Create new cart and add product(s)
        request.session['cart_data'] = cart_content

    cart_count = len(request.session.get("cart_data", 0))
    return Response({"status": "Success", "cart_count": cart_count})


@api_view(['POST'])
def save_paylater_details(request):
    token = request.data.get('token')
    address = request.data.get('address')
    optionalAddress = request.data.get('optionalAddress')
    phoneNumber = request.data.get('phoneNumber')
    deliveryInfo = request.data.get('deliveryInfo')
    delivery_method = 'SD' if deliveryInfo == 'free' else 'ND'

    session_data_query = [s.get_decoded() for s in Session.objects.all()
                          if s.get_decoded().get('cart_data')]
    all_dress_ids = [int(id) for id in session_data_query[0]['cart_data']]
    all_dress_quantity = [
        value for value in session_data_query[0]['cart_data'].values()]
    all_dresses = [Dress.objects.get(id=item) for item in all_dress_ids]

    user = Token.objects.get(key=token).user
    new_order = Order.objects.create(
        user=user,
        ref_code=create_ref_code(),
        being_processed=True,
        billing_address=address,
        phone_number=phoneNumber,
        delivery_type=delivery_method,
        payment_method='PL',
        alternative_billing_address=optionalAddress,
    )

    try:
        for index in range(len(all_dress_ids)):
            OrderItem.objects.create(
                product=all_dresses[index],
                quantity=all_dress_quantity[index],
                order=new_order
            )
    except Dress.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    return Response({'status': 'Success'})


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


@api_view(['GET'])
def fetch_user(request):
    the_token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
    try:
        token = Token.objects.get(key=the_token)
    except Token.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    response = {
        "first_name": token.user.first_name,
        "last_name": token.user.last_name,
        "email": token.user.email,
        'ok': True,
    }

    return Response(response)
