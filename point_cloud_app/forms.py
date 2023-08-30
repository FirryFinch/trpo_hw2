from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.core.exceptions import ValidationError

from .models import Class, Subclass, Object


class ClassForm(forms.ModelForm):
    class Meta:
        model = Class
        fields = "__all__"


class SubclassForm(forms.ModelForm):
    class Meta:
        model = Subclass
        fields = "__all__"


class ObjectForm(forms.ModelForm):
    class Meta:
        model = Object
        fields = ['name', 'subcl', 'length', 'width', 'height', 'num', 'file']


class LoginUserForm(AuthenticationForm):
    username = forms.CharField(label='Логин', widget=forms.TextInput(attrs={'class': 'form-input'}))
    password = forms.CharField(label='Пароль', widget=forms.PasswordInput(attrs={'class': 'form-input'}))

    def confirm_login_allowed(self, user):
        super().confirm_login_allowed(user)
        if not user.is_staff:
            raise ValidationError(
                self.error_messages["invalid_login"],
                code="invalid_login",
                params={"username": self.username_field.verbose_name},
            )
