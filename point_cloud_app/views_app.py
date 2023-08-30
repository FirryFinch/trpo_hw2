from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import LoginView
from django.contrib.auth import logout
from django.contrib.auth.models import User

from django.shortcuts import render, redirect
from django.views.generic import UpdateView

from point_cloud.settings import MINIO_STORAGE_ENDPOINT, MINIO_STORAGE_ACCESS_KEY, MINIO_STORAGE_SECRET_KEY, \
    MINIO_STORAGE_MEDIA_BUCKET_NAME

from .models import Class, Subclass, Object

from .forms import ClassForm, SubclassForm, ObjectForm, LoginUserForm

from minio import Minio

# Create your views here.

client = Minio(
    MINIO_STORAGE_ENDPOINT,
    access_key=MINIO_STORAGE_ACCESS_KEY,
    secret_key=MINIO_STORAGE_SECRET_KEY,
    secure=False,
)


@login_required
def main(request):
    return render(request, 'main.html')


def err404(request, exception):
    context = {'code': '404'}
    response = render(request, 'error.html', context=context)
    response.status_code = 404
    return response


def err400(request, exception):
    context = {'code': '400'}
    response = render(request, 'error.html', context=context)
    response.status_code = 400
    return response


def err403(request, exception):
    context = {'code': '403'}
    response = render(request, 'error.html', context=context)
    response.status_code = 403
    return response


def err500(request, *args, **argv):
    context = {'code': '500'}
    response = render(request, 'error.html', context=context)
    response.status_code = 500
    return response


class LoginUser(LoginView):
    form_class = LoginUserForm
    template_name = 'login.html'


def logout_user(request):
    logout(request)
    return redirect('login')


@login_required
def entities(request):
    return render(request, 'entities/entities_classes.html')


@login_required
def entities_classes(request):
    classes = Class.objects.all()
    subclasses = Subclass.objects.all()
    objects = Object.objects.all()
    return render(request, 'entities/entities_classes.html',
                  {'classes': classes, 'subclasses': subclasses, 'objects': objects})


@login_required
def new_class(request):
    if request.method == 'POST':
        form = ClassForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('entities_classes')
    else:
        form = ClassForm()
    return render(request, 'entities/entities_classes_new.html', {
        'form': form
    })


class EditClass(UpdateView):
    model = Class
    template_name = 'entities/entities_classes_edit.html'
    fields = "__all__"

    def form_valid(self, form):
        form.save()
        return redirect('entities_classes')


@login_required
def delete_class(request, pk):
    cl = Class.objects.get(id=pk)
    cl.delete()
    return redirect('entities_classes')


@login_required
def entities_subclasses(request):
    classes = Class.objects.all()
    subclasses = Subclass.objects.all()
    objects = Object.objects.all()
    return render(request, 'entities/entities_subclasses.html',
                  {'classes': classes, 'subclasses': subclasses, 'objects': objects})


@login_required
def new_subclass(request):
    if request.method == 'POST':
        form = SubclassForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('entities_subclasses')
    else:
        form = SubclassForm()
    return render(request, 'entities/entities_subclasses_new.html', {
        'form': form
    })


class EditSubclass(UpdateView):
    model = Subclass
    template_name = 'entities/entities_subclasses_edit.html'
    fields = "__all__"

    def form_valid(self, form):
        form.save()
        return redirect('entities_subclasses')


@login_required
def delete_subclass(request, pk):
    scl = Subclass.objects.get(id=pk)
    scl.delete()
    return redirect('entities_subclasses')


@login_required
def entities_objects(request):
    classes = Class.objects.all()
    subclasses = Subclass.objects.all()
    objects = Object.objects.all()
    return render(request, 'entities/entities_objects.html',
                  {'classes': classes, 'subclasses': subclasses, 'objects': objects})


@login_required
def new_object(request):
    if request.method == 'POST':
        form = ObjectForm(request.POST, request.FILES)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.created_by = request.user
            obj.save()
            return redirect('entities_objects')
    else:
        form = ObjectForm()
    return render(request, 'entities/entities_objects_new.html', {
        'form': form
    })


class EditObject(UpdateView):
    model = Object
    template_name = 'entities/entities_objects_edit.html'
    fields = ['name', 'subcl', 'num', 'file']

    def form_valid(self, form):
        form.save()
        return redirect('entities_objects')


@login_required
def delete_object(request, pk):
    ob = Object.objects.get(id=pk)
    client.remove_object(MINIO_STORAGE_MEDIA_BUCKET_NAME, ob.file.name)
    ob.delete()
    return redirect('entities_objects')


@login_required
def entities_files(request):
    objects = Object.objects.all()
    return render(request, 'entities/entities_files.html', {'objects': objects})


@login_required
def new_file(request):
    if request.method == 'POST':
        form = ObjectForm(request.POST, request.FILES)
        if form.is_valid():
            obj = form.save(commit=False)
            obj.created_by = request.user
            obj.save()
            return redirect('entities_files')
    else:
        form = ObjectForm()
    return render(request, 'entities/entities_files_new.html', {
        'form': form
    })


class EditFile(UpdateView):
    model = Object
    template_name = 'entities/entities_files_edit.html'
    fields = ['name', 'file']

    def form_valid(self, form):
        form.save()
        return redirect('entities_files')


@login_required
def delete_file(request, pk):
    ob = Object.objects.get(id=pk)
    client.remove_object(MINIO_STORAGE_MEDIA_BUCKET_NAME, ob.file.name)
    ob.delete()
    return redirect('entities_files')


@login_required
def users(request):
    us = User.objects.all()
    return render(request, 'users.html', {'us': us})
