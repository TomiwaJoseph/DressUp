from django.urls import path
from . import views

urlpatterns = [
    path('dress/<slug:slug>/', views.get_single__dress),
    path('dress/related/<slug:slug>/', views.get_related__dress),
    path('get-highest-price/', views.get_highest__price),
    path('get-hottest-dresses/', views.get_hottest__dresses),
    path('get-all-dresses-or-category/<slug:slug>/',
         views.get_all_dresses_or_category),
    path('get-all-categories/', views.get_all__categories),
    path('filter-category-price/', views.filter_category_price),
    # path('get-hottest-dresses/', views.TestView.as_view()),
    path('create-user/', views.UserCreate.as_view(), name='user_create'),
    path('login/', views.LoginView.as_view(), name='user_login')
]
