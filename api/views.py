import json
import math
import random
import string
import stripe
from django.contrib.sessions.models import Session
from django.contrib.auth import authenticate
from django.db.models import Q
from django.conf import settings
from rest_framework import status
from rest_framework import generics
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from users.models import CustomUser, Refund, Wishlist
from users.models import Order, OrderItem
from .serializers import CategorySerializer, DressSerializer, OrderDetailsSerializer,  OrderSerializer,  RegisterSerializer
from base.models import Category, Dress, DressImages, Newsletter


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
    random.seed(27)
    random.shuffle(data)
    serializer = DressSerializer(data[:7], many=True).data
    return Response(serializer)


@api_view(['POST'])
def search_dress(request):
    name = request.data.get('name')
    search_results = Dress.objects.filter(
        Q(name__contains=name)
    )
    serializer = DressSerializer(search_results, many=True).data
    return Response({'data': serializer})


@api_view(['POST'])
def filter_category_price(request):
    # Get the values passed in the request parameters
    minValue = request.data.get('minValue')
    maxValue = request.data.get('maxValue')
    category = request.data.get('categories')

    highest_price = max([object.price for object in Dress.objects.all()])
    all_categories = [
        category.title for category in Category.objects.all()] + ['All Dresses']
    if minValue < 0 or maxValue > highest_price:
        return Response(status=status.HTTP_403_FORBIDDEN)
    for section in category:
        if section not in all_categories:
            return Response(status=status.HTTP_403_FORBIDDEN)

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
        random.seed(1)
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


@api_view(['POST'])
def add_to_wishlist(request):
    dress_id = request.data.get('dressId')
    token = request.data.get('token')

    all_ids = [id.id for id in Dress.objects.all()]
    if dress_id not in all_ids:
        return Response(status=status.HTTP_403_FORBIDDEN)
    try:
        user = Token.objects.get(key=token).user
    except Token.DoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    product_to_add_to_wishlist = Dress.objects.get(id=dress_id)
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
    try:
        user = Token.objects.get(key=token).user
    except Token.DoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
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
    try:
        user = Token.objects.get(key=token).user
        wishlist_object_qs = Wishlist.objects.get(user=user)
        wishlist_object_qs.folder.remove(Dress.objects.get(id=id))
        wishlist_count = len(wishlist_object_qs.folder.all())
    except (Token.DoesNotExist, Dress.DoesNotExist):
        return Response(status=status.HTTP_403_FORBIDDEN)

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

    all_ids = [id.id for id in Dress.objects.all()]
    if dress_id not in all_ids:
        return Response(status=status.HTTP_400_BAD_REQUEST)

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
    if dress_id not in all_dresses_id or quantity > 5 or quantity < 1 or action not in ['increase', 'decrease']:
        return Response(status=status.HTTP_403_FORBIDDEN)

    session_data_query = [s.get_decoded() for s in Session.objects.all()
                          if s.get_decoded().get('cart_data')]
    cart = session_data_query[0]['cart_data']
    cart[str(dress_id)] = quantity - \
        1 if action == 'decrease' else quantity + 1

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
    try:
        user = Token.objects.get(key=token).user
    except Token.DoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    user_orders = list(Order.objects.filter(user=user))[::-1]
    serializer = OrderSerializer(user_orders, many=True).data
    return Response({"status": "Success", "user_orders": serializer})


@api_view(['POST'])
def add_to_newsletter(request):
    email = request.data.get('email')
    email_in_newsletter = Newsletter.objects.filter(email=email)
    if not email_in_newsletter:
        new_email = Newsletter.objects.create(email=email)
        new_email.save()

    return Response({"status": "Success", })


@api_view(['GET'])
def login_demo_user(request):
    user = CustomUser.objects.get(email='demouser@gmail.com')
    token = Token.objects.get_or_create(user=user)
    return Response({
        'user_info': {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email
        },
        'token': user.auth_token.key
    })


@api_view(['POST'])
def request_refund(request):
    token = request.data.get('token')
    ref_code = request.data.get('refCode')
    reason = request.data.get('reason')

    try:
        user = Token.objects.get(key=token).user
        # update the order
        order = Order.objects.get(user=user, ref_code=ref_code)
        order.refund_requested = True
        order.save()
        # document the refund request
        refund = Refund.objects.create(
            order=order,
            reason=reason,
            email=user.email
        )
        refund.save()
        return Response({"status": "Success"})
    except (Order.DoesNotExist, Token.DoesNotExist, Refund.DoesNotExist):
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def get_specific_order(request):
    token = request.data.get('token')
    ref_code = request.data.get('ref_code')
    try:
        user = Token.objects.get(key=token).user
        order_with_ref_code = Order.objects.filter(
            user=user, ref_code=ref_code).first()
        if not order_with_ref_code:
            return Response(status=status.HTTP_403_FORBIDDEN)
        all_dresses = OrderItem.objects.filter(order=order_with_ref_code)
        order_detail_serializer = OrderDetailsSerializer(
            order_with_ref_code, many=False).data

        dresses_serialized = DressSerializer(
            [dress.product for dress in all_dresses], many=True).data
        dress_quantity = [dress.quantity for dress in all_dresses]
        all_data = json.loads(json.dumps(dresses_serialized))
        order_item_data = []
        for index, object in enumerate(all_data):
            new_obj = object
            new_obj.update({'quantity': dress_quantity[index]})
            order_item_data.append(new_obj)
    except (Token.DoesNotExist, Order.DoesNotExist, OrderItem.DoesNotExist):
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    return Response({
        'order_item_data': order_item_data,
        "order_details": order_detail_serializer
    })


@api_view(['GET'])
def get_cart_content(request):
    session_query = [s.get_decoded() for s in Session.objects.all()
                     if s.get_decoded().get('cart_data')]
    if session_query:
        db_dress_ids = [obj.id for obj in Dress.objects.all()]
        all_dress_ids = [int(id) for id in session_query[0]['cart_data']]
        all_dress_quantity = [
            value for value in session_query[0]['cart_data'].values()]
        all_dresses = [Dress.objects.get(
            id=item) for item in all_dress_ids if item in db_dress_ids]
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

    all_dresses_id = [obj.id for obj in Dress.objects.all()]
    if dress_id not in all_dresses_id or quantity > 5 or quantity < 1:
        return Response(status=status.HTTP_403_FORBIDDEN)

    session_data_query = [s.get_decoded() for s in Session.objects.all()
                          if s.get_decoded().get('cart_data')]

    cart_content = {}
    cart_content[str(dress_id)] = quantity

    # If cart is in sesion storage
    if session_data_query:
        cart = session_data_query[0]['cart_data']
        # If the dress in in cart, update the quantity
        if str(dress_id) in cart:
            cart[str(dress_id)] = quantity
        else:
            # Else add the new dress
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

    try:
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
    except Token.DoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

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
    amount = math.ceil(data['amount'])
    order_info = data['orderInfo']
    token = data['token']

    # checking if customer with provided email already exists
    customer_data = stripe.Customer.list(email=email).data

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

    try:
        # creating paymentIntent
        payment_intent = stripe.PaymentIntent.create(
            customer=customer,
            payment_method=payment_method_id,
            currency='usd', amount=amount*100,
            confirm=True
        )
        # Only confirm an order after you have status: succeeded
        if payment_intent['status'] == 'succeeded':
            address = order_info[0]
            optionalAddress = order_info[1]
            phoneNumber = order_info[2]
            delivery_method = 'SD' if order_info[3] == 'free' else 'ND'

            session_data_query = [s.get_decoded() for s in Session.objects.all()
                                  if s.get_decoded().get('cart_data')]
            all_dress_ids = [int(id)
                             for id in session_data_query[0]['cart_data']]
            all_dress_quantity = [
                value for value in session_data_query[0]['cart_data'].values()]
            all_dresses = [Dress.objects.get(id=item)
                           for item in all_dress_ids]

            user = Token.objects.get(key=token).user
            new_order = Order.objects.create(
                user=user,
                ref_code=create_ref_code(),
                being_processed=True,
                billing_address=address,
                phone_number=phoneNumber,
                delivery_type=delivery_method,
                payment_method='PN',
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
                pass

            return Response(status=status.HTTP_200_OK, data={
                'message': 'Success',
                'data': {
                    'customer_id': customer.id,
                    'customer_email': customer.email,
                }
            })
        else:
            raise stripe.error.CardError
    except stripe.error.CardError as e:
        body = e.json_body
        err = body.get('error', {})
        return Response(status=status.HTTP_400_BAD_REQUEST, data={
            'error': err.get('message')
        })
    except stripe.error.RateLimitError as e:
        # Too many requests made to the API too quickly
        return Response(status=status.HTTP_400_BAD_REQUEST, data={
            'error': "The API was not able to respond, try again."
        })
    except stripe.error.InvalidRequestError as e:
        # invalid parameters were supplied to Stripe's API
        return Response(status=status.HTTP_400_BAD_REQUEST, data={
            'error': "Invalid parameters, unable to process payment."
        })
    except stripe.error.AuthenticationError as e:
        # Authentication with Stripe's API failed
        # (maybe you changed API keys recently)
        pass
    except stripe.error.APIConnectionError as e:
        # Network communication with Stripe failed
        return Response(status=status.HTTP_400_BAD_REQUEST, data={
            'error': 'Network communication failed, try again.'
        })
    except stripe.error.StripeError as e:
        # Display a very generic error to the user, and maybe
        # send yourself an email
        return Response(status=status.HTTP_400_BAD_REQUEST, data={
            'error': 'Internal Error, contact support.'
        })
    # Something else happened, completely unrelated to Stripe
    except Exception as e:
        return Response(status=status.HTTP_400_BAD_REQUEST, data={
            'error': 'Unable to process payment, try again.'
        })


@api_view(['GET'])
def fetch_user(request):
    the_token = request.META.get('HTTP_AUTHORIZATION').split(' ')[1]
    try:
        token = Token.objects.get(key=the_token)
    except Token.DoesNotExist:
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    response = {
        "first_name": token.user.first_name,
        "last_name": token.user.last_name,
        "email": token.user.email,
        'ok': True,
    }

    return Response(response)
