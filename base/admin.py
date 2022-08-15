# from atexit import register
from django.contrib import admin
from .models import (Category, Dress, DressImages, Newsletter, Reviews)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['category_title', 'category_slug']
    prepopulated_fields = {'category_slug': ('category_title',)}


admin.site.register(Category, CategoryAdmin)
admin.site.register(Dress)
admin.site.register(DressImages)
admin.site.register(Newsletter)
admin.site.register(Reviews)
