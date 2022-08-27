from django.urls import path, include
from . import views
# from knox import views as knox_views

urlpatterns = [
    path('dress/<slug:slug>/', views.get_single__dress),
    path('dress/related/<slug:slug>/', views.get_related__dress),
    path('get-highest-price/', views.get_highest__price),
    path('get-hottest-dresses/', views.get_hottest__dresses),
    path('get-all-dresses-or-category/<slug:slug>/',
         views.get_all_dresses_or_category),
    path('get-all-categories/', views.get_all__categories),
    path('filter-category-price/', views.filter_category_price),
    # AUTHENTICATION URLS
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/logout/', views.logout),
    path('auth/user/', views.UserAPI.as_view(), name='get_user'),
    # STRIPE URL
    path('stripe-payment/', views.stripe_payment, name='stripe-payment'),
    path('save-stripe-info/', views.save_stripe_info, name='save-stripe-info'),
]
