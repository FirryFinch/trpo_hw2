import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.core.files import File
from django.middleware.csrf import get_token
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from point_cloud_app.coordinates import get_x, get_z, get_y
from point_cloud_app.models import *


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

        return Response(
            {'detail': 'Successfully logged in', 'user_id': user.id, 'username': username, 'first_name': first_name,
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


class TranscationScript:
    def run(self):
        return 1


class GetClassesTS(TranscationScript, APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "title": output.title,
            } for output in ClassGateway.get_class_list(self)
        ]
        return Response(output)


class GetSubclassesTS(TranscationScript, APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "title": output.title,
                "cl_id": output.cl.id,
                "cl": output.cl.title
            } for output in SubclassGateway.get_subclass_list(self)
        ]
        return Response(output)


class GetObjectsTS(TranscationScript, APIView):
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
            } for output in ObjectGateway.get_object_list(self)
        ]
        return Response(output)


class AddNewObjectTS(TranscationScript, APIView):
    def post(self, request):
        file = File(request.data.get('file'))
        subcl = request.data.get('subcl')
        cr = request.data.get('created_by')
        length = request.data.get('length')
        width = request.data.get('width')
        height = request.data.get('height')
        name = request.data.get('name')
        num = request.data.get('num')
        ObjectGateway.add_object(self, file, subcl, cr, length, width, height, name, num)
        return Response({"status": "success"})
