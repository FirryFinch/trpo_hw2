from django.contrib import admin
from .models import Object, Class, Subclass


# Register your models here.

class ObjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'file', 'time_update')
    readonly_fields = ('time_create', 'time_update', 'created_by')

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user

        super(ObjectAdmin, self).save_model(
            request=request,
            obj=obj,
            form=form,
            change=change
        )


admin.site.register(Object, ObjectAdmin)

admin.site.register(Class)

admin.site.register(Subclass)

admin.site.site_header = 'Панель Django Admin'
admin.site.index_title = 'Главная'