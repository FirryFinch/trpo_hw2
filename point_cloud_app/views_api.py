import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.files import File
from django.middleware.csrf import get_token
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from point_cloud_app.coordinates import get_x, get_y, get_z
from point_cloud_app.models import Class, Subclass, Object
from point_cloud_app.serializer import ClassSerializer, SubclassSerializer

from minio import Minio

from point_cloud.settings import MINIO_STORAGE_ENDPOINT, MINIO_STORAGE_ACCESS_KEY, MINIO_STORAGE_SECRET_KEY, \
    MINIO_STORAGE_MEDIA_BUCKET_NAME

client = Minio(
    MINIO_STORAGE_ENDPOINT,
    access_key=MINIO_STORAGE_ACCESS_KEY,
    secret_key=MINIO_STORAGE_SECRET_KEY,
    secure=False,
)


@login_required
def listapi(request):
    return render(request, 'listapi.html')


@method_decorator(csrf_protect, name='dispatch')
class GetCSRF(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        response = Response({'detail': 'CSRF cookie successfully set'})
        response['X-CSRFToken'] = get_token(request)
        return response


@method_decorator(csrf_protect, name='dispatch')
class SessionView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'isAuthenticated': False})

        return Response({'isAuthenticated': True})


@method_decorator(csrf_protect, name='dispatch')
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if username is None or password is None:
            return Response({'detail': 'Please provide username and password'}, status=400)

        user = authenticate(username=username, password=password)

        first_name = user.first_name
        last_name = user.last_name

        if user is None:
            return Response({'detail': 'Invalid credentials'}, status=400)

        login(request, user)

        if user.is_staff or user.is_superuser:
            group = 'admin'
        else:
            group = 'user'

        return Response({'detail': 'Successfully logged in', 'user_id': user.id, 'username': username, 'first_name': first_name,
                         'last_name': last_name, 'group': group})


class LogoutView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'detail': 'You\'re not logged in'}, status=400)
        logout(request)
        return Response({'detail': 'Successfully logged out'})


class WhoAmI(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'isAuthenticated': False})

        if request.user.is_staff or request.user.is_superuser:
            group = 'admin'
        else:
            group = 'user'

        return Response({'username': request.user.username, 'first_name': request.user.first_name,
                         'last_name': request.user.last_name,
                         'group': group})


class ClassesView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "title": output.title
            } for output in Class.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = ClassSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class CustomEncoder(json.JSONEncoder):
    def default(self, o):
        return o.__dict__


class SubclassesView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "title": output.title,
                "cl_id": output.cl.id,
                "cl": output.cl.title
            } for output in Subclass.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = SubclassSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class ObjectsView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "name": output.name,
                "cl_id": output.subcl.cl.id,
                "cl": output.subcl.cl.title,
                "subcl_id": output.subcl.id,
                "subcl": output.subcl.title,
                "length": output.length,
                "width": output.width,
                "height": output.height,
                "time_create": output.time_create,
                "created_by_username": output.created_by.username,
                "created_by_first_name": output.created_by.first_name,
                "created_by_last_name": output.created_by.last_name,
                "time_update": output.time_update,
                "num": output.num,
                "file_url": output.file.url,
                "file_data_x": get_x(output.file),
                "file_data_y": get_y(output.file),
                "file_data_z": get_z(output.file),
            } for output in Object.objects.all()
        ]
        return Response(output)

    def post(self, request):
        loadedfile = File(request.data.get('file'))
        loadedsubclid = int(request.data.get('subcl'))
        subcl = Subclass.objects.get(id=loadedsubclid)
        loadedcreated = request.data.get('created_by')
        created = User.objects.get(id=loadedcreated)
        newObject = Object.objects.create(
            subcl=subcl,
            name=request.data.get('name'),
            length=request.data.get('length'),
            width=request.data.get('width'),
            height=request.data.get('height'),
            file=loadedfile,
            num=request.data.get('num'),
            created_by=created,
        )
        newObject.save()
        return Response({'status', 'success'})

    def delete(self, request):
        data = json.loads(request.body)
        del_id = data.get('id')
        ob = Object.objects.get(id=del_id)
        client.remove_object(MINIO_STORAGE_MEDIA_BUCKET_NAME, ob.file.name)
        ob.delete()
        return Response({'status', 'success'})

    def put(self, request):
        data = json.loads(request.body)
        ob = Object.objects.get(id=data.get('id'))
        ob.name = data.get('name')
        ob.subcl = Subclass.objects.get(title=data.get('subcl'))
        ob.length = data.get('length')
        ob.width = data.get('width')
        ob.height = data.get('height')
        ob.num = data.get('num')
        ob.save()
        return Response({'status', 'success'})

