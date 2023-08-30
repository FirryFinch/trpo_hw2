import json

from django.db import models
from django.contrib.auth.models import User

from point_cloud_app.validators import validate_is_las

# Create your models here.


class Class(models.Model):
    title = models.CharField(max_length=50, verbose_name="Наименование класса")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Класс'
        verbose_name_plural = 'Классы'


class Subclass(models.Model):
    cl = models.ForeignKey(Class, on_delete=models.CASCADE, verbose_name="Класс")

    title = models.CharField(max_length=50, verbose_name="Наименование подкласса")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Подкласс'
        verbose_name_plural = 'Подклассы'


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
        return self.name

    def save(self, *args, **kwargs):
        if self.pk:
            this_record = Object.objects.get(pk=self.pk)
            if this_record.file != self.file:
                this_record.file.delete(save=False)
        super(Object, self).save(*args, **kwargs)

    class Meta:
        verbose_name = 'Объект'
        verbose_name_plural = 'Объекты'
