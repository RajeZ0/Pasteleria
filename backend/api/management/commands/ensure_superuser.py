import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update the default superuser if it does not exist."

    def handle(self, *args, **options):
        User = get_user_model()
        email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
        username = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "Admin123!")

        if not email or not password:
            self.stdout.write(
                self.style.WARNING(
                    "DJANGO_SUPERUSER_EMAIL and DJANGO_SUPERUSER_PASSWORD must be set to create the default admin."
                )
            )
            return

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "is_staff": True,
                "is_superuser": True,
                "role": User.Role.ADMIN,
            },
        )

        if created:
            user.set_password(password)
            user.save(update_fields=["password"])
            self.stdout.write(
                self.style.SUCCESS(f"Superuser {email} created with default credentials.")
            )
            return

        updated = False
        if not user.is_staff or not user.is_superuser:
            user.is_staff = True
            user.is_superuser = True
            updated = True
        if user.role != User.Role.ADMIN:
            user.role = User.Role.ADMIN
            updated = True
        if updated:
            user.save(update_fields=["is_staff", "is_superuser", "role"])
            self.stdout.write(self.style.WARNING(f"Superuser {email} permissions refreshed."))
        else:
            self.stdout.write(f"Superuser {email} already exists.")
