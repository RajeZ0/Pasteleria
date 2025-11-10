from decimal import Decimal

from django.db.models import Count, Sum, F, DecimalField
from django.db.models.functions import TruncMonth
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactMessage, Order, Product, User
from .notifications import send_ntfy_message
from .permissions import IsAdmin, IsAdminOrReadOnly
from .serializers import (
    ContactMessageSerializer,
    LoginSerializer,
    OrderSerializer,
    ProductSerializer,
    RegisterSerializer,
    ReportSerializer,
    UserSerializer,
)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "user": UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(role=User.Role.CUSTOMER)
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Order.objects.select_related("customer").prefetch_related("items__product")
        user = self.request.user
        if user.role == User.Role.ADMIN:
            return qs.order_by("-order_date")
        return qs.filter(customer=user).order_by("-order_date")

    def perform_create(self, serializer):
        request_user = self.request.user
        customer = serializer.validated_data.get("customer")
        if getattr(request_user, "role", None) != User.Role.ADMIN or customer is None:
            order = serializer.save(customer=request_user)
        else:
            order = serializer.save()
        self._notify_order_created(order)

    def perform_update(self, serializer):
        request_user = self.request.user
        instance = serializer.instance
        if getattr(request_user, "role", None) != User.Role.ADMIN and instance.customer != request_user:
            raise PermissionDenied("No puede modificar pedidos de otros clientes.")
        customer = serializer.validated_data.get("customer", instance.customer)
        serializer.save(customer=customer)

    @action(detail=True, methods=["post"], permission_classes=[IsAdmin])
    def set_status(self, request, pk=None):
        order = self.get_object()
        status_value = request.data.get("status")
        if status_value not in dict(Order.Status.choices):
            return Response({"detail": "Estado invalido."}, status=status.HTTP_400_BAD_REQUEST)
        previous_status_display = order.get_status_display()
        order.status = status_value
        order.save()
        self._notify_order_status_updated(order, previous_status_display)
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    def _notify_order_created(self, order):
        total_items = order.items.count()
        total_formatted = format(order.total, ".2f")
        customer_name = self._get_customer_display(order.customer)
        message = (
            f"Pedido #{order.id} creado por {customer_name}. "
            f"Productos: {total_items}. Total estimado: ${total_formatted}."
        )
        send_ntfy_message(
            message,
            title="Nuevo pedido",
            tags=["bell"],
        )

    def _notify_order_status_updated(self, order, previous_status_display):
        customer_name = self._get_customer_display(order.customer)
        message = (
            f"Pedido #{order.id} actualizado para {customer_name}: "
            f"{previous_status_display} → {order.get_status_display()}."
        )
        send_ntfy_message(
            message,
            title="Estado de pedido",
            tags=["information"],
        )

    @staticmethod
    def _get_customer_display(customer):
        full_name = customer.get_full_name().strip()
        return full_name or customer.email


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.select_related("customer").order_by("-created_at")
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.action in ["create"]:
            return [AllowAny()]
        return [IsAdmin()]

    def perform_create(self, serializer):
        customer = self.request.user if self.request.user.is_authenticated else None
        serializer.save(customer=customer)


class ReportView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, *args, **kwargs):
        total_orders = Order.objects.count()
        revenue = Order.objects.prefetch_related("items__product")
        revenue_value = (
            revenue.aggregate(
                total=Sum(
                    F("items__quantity") * F("items__product__price"),
                    output_field=DecimalField(max_digits=12, decimal_places=2),
                )
            )["total"]
            or Decimal("0.00")
        )

        orders_by_status = (
            Order.objects.values("status")
            .annotate(total=Count("id"))
            .order_by("status")
        )
        status_dict = {item["status"]: item["total"] for item in orders_by_status}

        monthly_sales = (
            Order.objects.annotate(month=TruncMonth("order_date"))
            .values("month")
            .annotate(total=Count("id"))
            .order_by("month")
        )
        monthly_sales_payload = [
            {"month": item["month"].strftime("%Y-%m") if item["month"] else None, "total": item["total"]}
            for item in monthly_sales
        ]

        top_products = (
            Product.objects.annotate(total_sold=Sum("order_items__quantity"))
            .order_by("-total_sold")[:5]
        )
        top_products_payload = [
            {"id": product.id, "name": product.name, "total_sold": product.total_sold or 0}
            for product in top_products
        ]

        payload = {
            "total_orders": total_orders,
            "total_revenue": revenue_value,
            "orders_by_status": status_dict,
            "monthly_sales": monthly_sales_payload,
            "top_products": top_products_payload,
        }
        serializer = ReportSerializer(payload)
        return Response(serializer.data)
