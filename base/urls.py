from django.urls import path
from base.views import get_dress_or_order, index


urlpatterns = [
    path('', index),
    path('shop', index),
    path('shop/dress/<slug:slug>', get_dress_or_order),
    path('user/track-order/<slug:slug>', get_dress_or_order),
    path('about', index),
    path('contact-us', index),
    path('cart', index),
    path('sign-up', index),
    path('login', index),
    path('order/refund', index),
    path('search-dress', index),
    path('user/dashboard', index),
    path('shop/checkout', index),
]
