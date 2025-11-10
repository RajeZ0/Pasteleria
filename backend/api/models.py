from decimal import Decimal

from django.conf import settings
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("El correo electronico es obligatorio.")
        email = self.normalize_email(email)
        username = extra_fields.pop("username", None) or email
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("role", self.model.Role.CUSTOMER)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", self.model.Role.ADMIN)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser debe tener is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser debe tener is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser):
    class Role(models.TextChoices):
        CUSTOMER = "customer", "Cliente"
        ADMIN = "admin", "Administrador"

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    def __str__(self) -> str:
        return f"{self.username} ({self.role})"


class Product(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    image = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class Order(models.Model):
    class Status(models.TextChoices):
        NEW = "new", "Nuevo"
        IN_PROGRESS = "in_process", "En proceso"
        COMPLETED = "completed", "Completado"

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="orders", on_delete=models.CASCADE
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)
    order_date = models.DateTimeField(default=timezone.now)
    delivery_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    @property
    def total(self) -> float:
        return sum((item.subtotal for item in self.items.all()), Decimal("0.00"))

    def __str__(self) -> str:
        return f"Pedido #{self.pk} - {self.customer}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name="order_items", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    personalization = models.TextField(blank=True)

    @property
    def subtotal(self) -> float:
        return Decimal(self.quantity) * self.product.price

    def __str__(self) -> str:
        return f"{self.product} x{self.quantity}"


class ContactMessage(models.Model):
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="contact_messages",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Mensaje #{self.pk}"
