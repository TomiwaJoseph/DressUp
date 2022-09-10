from django.urls import path, include
from . import views

urlpatterns = [
    path('dress/<slug:slug>/', views.get_single_dress),
    path('dress/related/<slug:slug>/', views.get_related_dress),
    path('get-highest-price/', views.get_highest_price),
    path('get-hottest-dresses/', views.get_hottest_dresses),
    path('get-all-dresses-or-category/<slug:slug>/',
         views.get_all_dresses_or_category),
    path('get-all-categories/', views.get_all_categories),
    path('filter-category-price/', views.filter_category_price),
    path('save-paylater-details/', views.save_paylater_details),
    path('add-to-wishlist/', views.add_to_wishlist),
    path('add-to-cart/', views.add_to_cart),
    path('get-cart-content/', views.get_cart_content),
    path('remove-cart-item/', views.remove_cart_item),
    path('change-cart-item/', views.change_cart_content),
    path('remove-cart/', views.remove_cart),
    path('get-cart-count/', views.get_cart_count),
    path('fetch-wishlist-dresses/', views.get_wishlist_dresses),
    path('delete-wishlist-dress/', views.delete_wishlist_dress),
    path('get-user-orders/', views.get_user_orders),
    path('get-specific-order/', views.get_specific_order),
    path('request-refund/', views.request_refund),
    path('add-to-newsletter/', views.add_to_newsletter),
    path('search-dress/', views.search_dress),
    # AUTHENTICATION URLS
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('login-demo-user/', views.login_demo_user, name='demo-login'),
    path('auth/logout/', views.logout),
    path('auth/user/', views.fetch_user, name='fetch_user'),
    # STRIPE URL
    path('save-stripe-info/', views.save_stripe_info, name='save-stripe-info'),
]
