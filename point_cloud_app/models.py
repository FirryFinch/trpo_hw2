from django.db import models

from django.contrib.auth.models import User

from minio import Minio

from point_cloud.settings import MINIO_STORAGE_ENDPOINT, MINIO_STORAGE_ACCESS_KEY, MINIO_STORAGE_SECRET_KEY, \
    MINIO_STORAGE_MEDIA_BUCKET_NAME

from point_cloud_app.validators import validate_is_las

client = Minio(
    MINIO_STORAGE_ENDPOINT,
    access_key=MINIO_STORAGE_ACCESS_KEY,
    secret_key=MINIO_STORAGE_SECRET_KEY,
    secure=False,
)

# Create your models here.


class Class(models.Model):
    title = models.CharField(max_length=50, verbose_name="Наименование класса")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Класс'
        verbose_name_plural = 'Классы'

    def add_class(self, tit):
        return ClassGateway.add_class(self, tit)

    def change_class(self, id, tit):
        return ClassGateway.change_class(self, id, tit)

    def get_class_list(self):
        return ClassGateway.get_class_list(self)

    def delete_class(self, id):
        return ClassGateway.delete_class(self, id)


class ClassGateway:
    def add_class(self, tit):
        Class.objects.create(title=tit).save()
        return 1

    def change_class(self, id, tit):
        cl = Class.objects.get(id=id)
        cl.title = tit
        cl.save()
        return cl

    def get_class_list(self):
        return Class.objects.all()

    def delete_class(self, id):
        return Class.objects.get(id=id).delete()


class Subclass(models.Model):
    cl = models.ForeignKey(Class, on_delete=models.CASCADE, verbose_name="Класс")
    title = models.CharField(max_length=50, verbose_name="Наименование подкласса")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Подкласс'
        verbose_name_plural = 'Подклассы'

    def add_subclass(self, tit, cl):
        return SubclassGateway.add_subclass(self, tit, cl)

    def change_subclass(self, id, tit, cl):
        return SubclassGateway.change_subclass(self, id, tit, cl)

    def get_subclass_list(self):
        return SubclassGateway.get_subclass_list(self)

    def delete_subclass(self, id):
        return SubclassGateway.delete_subclass(self, id)


class SubclassGateway:
    def add_subclass(self, tit, cl):
        Subclass.objects.create(title=tit, cl=cl).save()
        return 1

    def change_subclass(self, id, tit, cl):
        sub = Subclass.objects.get(id=id)
        sub.title = tit
        sub.cl = cl
        sub.save()
        return sub

    def get_subclass_list(self):
        return Subclass.objects.all()

    def delete_subclass(self, id):
        return Subclass.objects.get(id=id).delete()


class Object(models.Model):
    subcl = models.ForeignKey(Subclass, on_delete=models.CASCADE, verbose_name="Подкласс")
    name = models.CharField(max_length=50, verbose_name="Название объекта")
    length = models.DecimalField(max_digits=12, decimal_places=6, verbose_name="Длина объекта")
    width = models.DecimalField(max_digits=12, decimal_places=6, verbose_name="Ширина объекта")
    height = models.DecimalField(max_digits=12, decimal_places=6, verbose_name="Высота объекта")
    time_create = models.DateTimeField(verbose_name="Время формирования", auto_now_add=True)
    time_update = models.DateTimeField(verbose_name="Время изменения", auto_now=True)
    file = models.FileField(verbose_name="Файл", validators=(validate_is_las,))
    num = models.CharField(max_length=5, verbose_name="Номер аудитории", default='0')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Добавил")

    def __str__(self):
        return str(self.name)

    def save(self, *args, **kwargs):
        if self.pk:
            this_record = Object.objects.get(pk=self.pk)
            if this_record.file != self.file:
                this_record.file.delete(save=False)
        super(Object, self).save(*args, **kwargs)

    class Meta:
        verbose_name = 'Объект'
        verbose_name_plural = 'Объекты'

    def add_object(self, file, subcl, cr, length, width, height, name, num):
        return ObjectGateway.add_object(self, file, subcl, cr, length, width, height, name, num)

    def change_object(self, id, file, subcl, length, width, height, name, num):
        return ObjectGateway.change_object(self, id, file, subcl, length, width, height, name, num)

    def get_object_list(self):
        return ObjectGateway.get_object_list(self)

    def delete_object(self, id):
        return ObjectGateway.delete_object(self, id)


class ObjectGateway:
    def add_object(self, file, subclid, cr, length, width, height, name, num):
        subclid = int(subclid)
        subcl = Subclass.objects.get(id=subclid)
        created = User.objects.get(id=cr)
        Object.objects.create(subcl=subcl, name=name, length=length, width=width, height=height, file=file, num=num,
                              created_by=created).save()
        return 1

    def change_object(self, id, file, subcl, length, width, height, name, num):
        subclid = int(subcl)
        obj = Object.objects.get(id=id)
        obj.subcl = subclid
        obj.name = name
        obj.length = length
        obj.width = width
        obj.height = height
        obj.file = file
        obj.num = num
        obj.save()
        return obj

    def get_object_list(self):
        return Object.objects.all()

    def delete_object(self, id):
        obj = Object.objects.get(id=id)
        client.remove_object(MINIO_STORAGE_MEDIA_BUCKET_NAME, obj.file.name)
        return obj.delete()