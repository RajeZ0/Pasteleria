from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ContactMessageViewSet,
    CustomerViewSet,
    LoginView,
    OrderViewSet,
    ProductViewSet,
    RegisterView,
    ReportView,
)

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")
router.register(r"orders", OrderViewSet, basename="order")
router.register(r"customers", CustomerViewSet, basename="customer")
router.register(r"contact", ContactMessageViewSet, basename="contact")

urlpatterns = [
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("reports/overview/", ReportView.as_view(), name="reports-overview"),
    path("", include(router.urls)),
]
