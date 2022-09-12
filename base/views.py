from django.shortcuts import render


def index(request):
    return render(request, 'index.html')


def get_dress_or_order(request, slug):
    return render(request, 'index.html')
