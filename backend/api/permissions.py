from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user_role = getattr(request.user, "role", None)
        return request.user and request.user.is_authenticated and user_role == "admin"


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        user_role = getattr(request.user, "role", None)
        return request.user and request.user.is_authenticated and user_role == "admin"
