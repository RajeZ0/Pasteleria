from django.core import management
from django.core.management.base import BaseCommand

from api.models import Product


class Command(BaseCommand):
    help = "Carga productos predeterminados desde la fixture si la tabla esta vacia."

    def handle(self, *args, **options):
        if Product.objects.exists():
            self.stdout.write("La tabla de productos ya contiene registros. Se omite la carga inicial.")
            return

        management.call_command("loaddata", "initial_products", verbosity=0)
        count = Product.objects.count()
        self.stdout.write(self.style.SUCCESS(f"Se cargaron {count} productos predeterminados."))
