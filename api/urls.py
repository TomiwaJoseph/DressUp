from django.urls import path
from . import views

urlpatterns = [
    path('list-them/', views.getData),
    path('users/', views.UserCreate.as_view()),
    path('login/', views.LoginView.as_view())
]
