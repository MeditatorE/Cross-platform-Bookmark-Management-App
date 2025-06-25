from django.apps import AppConfig

from apps import app_core


class AppCoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.app_core'
