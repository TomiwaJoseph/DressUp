from django.contrib import admin
from .models import (Category, Dress, DressImages, Newsletter, Reviews)


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'slug']
    prepopulated_fields = {'slug': ('title',)}


class DressAdmin(admin.ModelAdmin):
    list_display = ['name', 'category',
                    'price', 'discount_price',
                    'image_tag', 'availability']
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ['discount_price', 'availability']
    list_filter = ['category']
    search_fields = ['name', 'price']


admin.site.register(Category, CategoryAdmin)
admin.site.register(Dress, DressAdmin)
admin.site.register(DressImages)
admin.site.register(Newsletter)
admin.site.register(Reviews)
