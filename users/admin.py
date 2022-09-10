from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import CustomUser, Order, OrderItem, Refund, Wishlist


@admin.register(CustomUser)
class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {'fields': (
            'is_active', 'is_staff', 'is_superuser',
            'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')})
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )
    list_display = ('email', 'first_name', 'last_name', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email', 'first_name', 'last_name')


class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['product', 'quantity']


class OrderAdmin(admin.ModelAdmin):
    list_editable = ['being_processed', 'delivered',
                     'refund_requested', 'refund_granted']
    list_display = ['user', 'ref_code', 'paid_for', 'payment_date', 'being_processed', 'delivered',
                    'refund_requested', 'refund_granted']


admin.site.register(Wishlist)
admin.site.register(Refund)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
