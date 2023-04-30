from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _



class StaffConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'book_store.apps.staff'
    verbose_name = _("Staff")

    # def ready(self):
        # from .signals import create_system_administrator