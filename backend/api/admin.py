from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import ContactMessage, Order, OrderItem, Product, User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    fieldsets = DjangoUserAdmin.fieldsets + (
        ("Rol", {"fields": ("role",)}),
    )
    list_display = ("username", "email", "role", "is_staff", "is_active")
    list_filter = ("role", "is_staff", "is_superuser", "is_active")
    search_fields = ("username", "email")


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "stock", "created_at")
    search_fields = ("name",)
    list_filter = ("created_at",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "status", "order_date", "delivery_date")
    list_filter = ("status", "order_date")
    search_fields = ("customer__username", "customer__email")
    inlines = [OrderItemInline]


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "created_at")
    search_fields = ("customer__username", "message")

# Register your models here.
