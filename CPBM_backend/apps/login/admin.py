from django.contrib import admin

# Register your models here.
from apps.login.models import SiteUser, ConfirmString
class SiteUserAdmin(admin.ModelAdmin):
    list_display = ['name','gender']
    list_filter = ['name']
    list_per_page = 2
    list_display_links = ['name']
admin.site.register(SiteUser,SiteUserAdmin)
admin.site.register(ConfirmString)
