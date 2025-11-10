from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import ContactMessage, Order, OrderItem, Product, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "role"]
        read_only_fields = ["id", "role"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "confirm_password", "first_name", "last_name"]

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError("Las contrasenas no coinciden.")
        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(role=User.Role.CUSTOMER, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")
        user = authenticate(username=email, password=password)
        if not user:
            try:
                user_obj = User.objects.get(email=email)
            except User.DoesNotExist as exc:
                raise serializers.ValidationError("Credenciales invalidas.") from exc
            user = authenticate(username=user_obj.username, password=password)
        if not user:
            raise serializers.ValidationError("Credenciales invalidas.")
        data["user"] = user
        return data


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    product_detail = ProductSerializer(source="product", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_detail", "quantity", "personalization", "subtotal"]
        read_only_fields = ["id", "subtotal", "product_detail"]


class OrderSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source="customer", required=False, allow_null=True
    )
    items = OrderItemSerializer(many=True)
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "customer_id",
            "status",
            "order_date",
            "delivery_date",
            "notes",
            "items",
            "total",
        ]
        read_only_fields = ["id", "order_date", "total"]

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Debe incluir al menos un producto en el pedido.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        order = Order.objects.create(**validated_data)
        self._sync_items(order, items_data)
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            self._sync_items(instance, items_data)
        return instance

    def _sync_items(self, order, items_data):
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)


class ContactMessageSerializer(serializers.ModelSerializer):
    customer = UserSerializer(read_only=True)

    class Meta:
        model = ContactMessage
        fields = ["id", "customer", "message", "created_at"]
        read_only_fields = ["id", "customer", "created_at"]


class ReportSerializer(serializers.Serializer):
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    orders_by_status = serializers.DictField(child=serializers.IntegerField())
    monthly_sales = serializers.ListField(child=serializers.DictField())
    top_products = serializers.ListField(child=serializers.DictField())
